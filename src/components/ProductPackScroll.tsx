import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { Product } from '../data/products';
import { useIsMobile } from '../hooks/useIsMobile';

interface Props {
  product: Product;
  mobileContent?: ReactNode;
}

const IMG_ASPECT = 16 / 9;
const SOURCE_WIDTH = 1280;
const SOURCE_HEIGHT = 720;
const WARMUP_CONCURRENCY = 6;

// Coarse-to-fine order so the whole animation is roughly scrubbable early.
function getWarmupOrder(totalFrames: number) {
  const seen = new Set<number>([0]);
  const order: number[] = [];
  for (const step of [24, 12, 6, 3, 1]) {
    for (let index = step; index < totalFrames; index += step) {
      if (!seen.has(index)) {
        seen.add(index);
        order.push(index);
      }
    }
  }
  if (!seen.has(totalFrames - 1)) order.push(totalFrames - 1);
  return order;
}

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dghhdz3et';
const USE_CLOUDINARY = import.meta.env.VITE_USE_CLOUDINARY !== 'false';
// Keep in sync with the preload link in index.html so the first frame is a cache hit.
const CLOUDINARY_TRANSFORM = 'f_auto,q_auto:eco';

function getFrameSrc(product: Product, frameNumber: number) {
  const sourceFrameNumber = (product.frameStart ?? 1) + frameNumber - 1;
  const padded = sourceFrameNumber.toString().padStart(product.framePadLength ?? 3, '0');
  const fileName = `${product.framePrefix ?? ''}${padded}.${product.frameExtension || 'jpg'}`;

  if (USE_CLOUDINARY && product.cloudinaryFolder) {
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${CLOUDINARY_TRANSFORM}/${product.cloudinaryFolder}/${fileName}`;
  }
  return `${product.folderPath}/${fileName}`;
}

export default function ProductPackScroll({ product, mobileContent }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef(0);
  const isMobile = useIsMobile();
  const totalFrames = product.frameCount || 120;

  const getNearestLoadedImage = useCallback((targetIndex: number) => {
    const images = imagesRef.current;
    const exact = images[targetIndex];
    if (exact?.complete && exact.naturalWidth) return exact;

    for (let distance = 1; distance < totalFrames; distance += 1) {
      const before = images[targetIndex - distance];
      if (before?.complete && before.naturalWidth) return before;

      const after = images[targetIndex + distance];
      if (after?.complete && after.naturalWidth) return after;
    }

    return null;
  }, [totalFrames]);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const image = getNearestLoadedImage(Math.max(0, Math.min(totalFrames - 1, index)));
    if (!canvas || !image) return;

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    const canvasAspect = canvas.width / canvas.height;
    const imageAspect = image.width / image.height;
    let drawWidth: number;
    let drawHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (isMobile) {
      drawWidth = canvas.width;
      drawHeight = drawWidth / imageAspect;
      offsetX = 0;
      offsetY = 0;
    } else if (canvasAspect > imageAspect) {
      drawWidth = canvas.width;
      drawHeight = drawWidth / imageAspect;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawHeight = canvas.height;
      drawWidth = drawHeight * imageAspect;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    context.fillStyle = '#0B1D16';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  }, [getNearestLoadedImage, isMobile, totalFrames]);

  useEffect(() => {
    imagesRef.current = new Array(totalFrames).fill(null);
    currentFrameRef.current = 0;

    let isMounted = true;
    let animationFrame = 0;
    let idleHandle = 0;
    const scheduleTimeout = window.setTimeout.bind(window);
    const cancelTimeout = window.clearTimeout.bind(window);
    const pending = new Map<number, Promise<HTMLImageElement | null>>();
    const failed = new Set<number>();

    const loadFrame = (index: number) => {
      if (index < 0 || index >= totalFrames || failed.has(index)) {
        return Promise.resolve(null);
      }

      const loaded = imagesRef.current[index];
      if (loaded) return Promise.resolve(loaded);

      const existingRequest = pending.get(index);
      if (existingRequest) return existingRequest;

      const request = new Promise<HTMLImageElement | null>((resolve) => {
        const image = new Image();
        image.decoding = 'async';

        image.onload = async () => {
          try {
            await image.decode();
          } catch {
            // The load event still provides a drawable image when decode is unsupported.
          }

          if (isMounted) {
            imagesRef.current[index] = image;
            if (index === currentFrameRef.current || index === 0) drawFrame(currentFrameRef.current);
          }
          resolve(image);
        };

        image.onerror = () => {
          failed.add(index);
          resolve(null);
        };

        image.src = getFrameSrc(product, index + 1);
      }).finally(() => pending.delete(index));

      pending.set(index, request);
      return request;
    };

    const loadAround = (targetIndex: number, direction: number) => {
      void loadFrame(targetIndex);
      void loadFrame(targetIndex + direction);
      void loadFrame(targetIndex + direction * 2);
      void loadFrame(targetIndex - direction);
    };

    const updateFrameFromScroll = () => {
      animationFrame = 0;
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollableDistance = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));
      const targetIndex = Math.round(progress * (totalFrames - 1));
      if (targetIndex === currentFrameRef.current) return;

      const direction = targetIndex >= currentFrameRef.current ? 1 : -1;
      currentFrameRef.current = targetIndex;
      drawFrame(targetIndex);
      loadAround(targetIndex, direction);
    };

    const requestScrollUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateFrameFromScroll);
    };

    const warmFrames = async () => {
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      const order = getWarmupOrder(totalFrames).filter((index) => !connection?.saveData || index % 12 === 0);
      let next = 0;
      const worker = async () => {
        while (isMounted && next < order.length) await loadFrame(order[next++]);
      };
      await Promise.all(Array.from({ length: WARMUP_CONCURRENCY }, worker));
    };

    const scheduleIdleWarmup = () => {
      if ('requestIdleCallback' in window) {
        idleHandle = window.requestIdleCallback(() => void warmFrames(), { timeout: 300 });
      } else {
        idleHandle = scheduleTimeout(() => void warmFrames(), 100);
      }
    };

    void loadFrame(0).then((image) => {
      if (!isMounted) return;
      if (image) drawFrame(currentFrameRef.current);
      scheduleIdleWarmup();
    });

    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    window.addEventListener('resize', requestScrollUpdate, { passive: true });
    requestScrollUpdate();

    return () => {
      isMounted = false;
      window.removeEventListener('scroll', requestScrollUpdate);
      window.removeEventListener('resize', requestScrollUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleHandle);
      else cancelTimeout(idleHandle);
    };
  }, [drawFrame, product, totalFrames]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const clientWidth = Math.max(1, canvas.clientWidth);
      const clientHeight = Math.max(1, canvas.clientHeight);
      const deviceScale = Math.min(window.devicePixelRatio || 1, 2);
      const scale = Math.min(deviceScale, SOURCE_WIDTH / clientWidth, SOURCE_HEIGHT / clientHeight);
      canvas.width = Math.round(clientWidth * scale);
      canvas.height = Math.round(clientHeight * scale);
      drawFrame(currentFrameRef.current);
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);
    resizeCanvas();
    return () => resizeObserver.disconnect();
  }, [drawFrame]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isMobile ? 'h-[300vh] pt-[var(--nav-height)]' : 'h-[240vh]'}`}
    >
      <div
        className={`w-full overflow-hidden bg-brand-forest lg:bg-brand-surface ${
          isMobile ? 'sticky top-[var(--nav-height)]' : 'sticky top-0 h-[100dvh]'
        }`}
      >
        <div className={`relative w-full bg-brand-forest ${isMobile ? '' : 'h-full'}`}>
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={`${product.name} product animation`}
            className="w-full block"
            style={
              isMobile
                ? { height: `calc(100vw / ${IMG_ASPECT})` }
                : { height: '100%', minHeight: '100%' }
            }
          />

        </div>

        {isMobile && mobileContent && (
          <div id="story" className="bg-brand-parchment border-t border-brand-border px-4 sm:px-6 py-10 sm:py-14">
            {mobileContent}
          </div>
        )}

        {!isMobile && (
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: product.gradient,
              maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
            }}
          />
        )}
      </div>
    </div>
  );
}
