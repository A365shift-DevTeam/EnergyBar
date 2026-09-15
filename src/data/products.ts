export interface Product {
  id: string;
  name: string;
  subName: string;
  image?: string;
  description: string;
  folderPath: string;
  /** Cloudinary folder holding the frames; falls back to folderPath when unset. */
  cloudinaryFolder?: string;
  frameCount?: number;
  frameStart?: number;
  framePrefix?: string;
  framePadLength?: number;
  frameExtension?: string;
  themeColor: string;
  gradient: string;
  features: string[];
  stats: { label: string; val: string }[];
  section1: { title: string; subtitle: string };
  section2: { title: string; subtitle: string };
  section3: { title: string; subtitle: string };
  section4: { title: string; subtitle: string };
  detailsSection: { title: string; description: string; imageAlt: string };
  freshnessSection: { title: string; description: string };
  craftSection: {
    label: string;
    title: string;
    description: string;
    processingParams: string[];
  };
}

export const products: Product[] = [
  {
    id: "energy-bar",
    name: "Energy Bar",
    subName: "Jaggery-kissed energy.",
    image: "/energy-bar.webp",
    description: "Jaggery Bound - Millet Seeds - Sesame - No Refined Sugar",
    folderPath: "/1st-product",
    cloudinaryFolder: "energy-bar-frames",
    frameCount: 210,
    frameStart: 31,
    framePrefix: "",
    framePadLength: 8,
    frameExtension: "webp",
    themeColor: "#92400E",
    gradient: "linear-gradient(135deg, #B45309 0%, #78350F 100%)",
    features: ["Jaggery Bound", "No Refined Sugar", "Natural Energy Bar"],
    stats: [
      { label: "Refined Sugar", val: "0g" },
      { label: "Jaggery", val: "100%" },
      { label: "Millet", val: "Rich" }
    ],
    section1: { title: "Energy Bar.", subtitle: "Jaggery-kissed energy." },
    section2: {
      title: "The bar your grandmother would approve.",
      subtitle: "Real jaggery, toasted millet seeds, and sesame — an energy bar the Indian way."
    },
    section3: {
      title: "Sustained energy, zero spike.",
      subtitle: "Jaggery releases energy slowly — no sugar crash, just steady fuel through your busiest hours."
    },
    section4: { title: "One bite. Hours of energy.", subtitle: "" },
    detailsSection: {
      title: "The Original Energy Bar",
      description: "Long before protein bars existed, India had chikki. Energy Bar elevates this tradition with a base of foxtail and pearl millet seeds, bound in pure A-grade jaggery sourced directly from Kolhapur farmers. Each bar is hand-pressed, cut by eye, and cooled slowly to preserve a satisfying, glass-like snap.",
      imageAlt: "Energy Bar product"
    },
    freshnessSection: {
      title: "Pressed by Hand, Packed with Care",
      description: "Machine-pressed chikki loses texture. Ours is hand-pressed in small batches, inspected for consistency, and individually wrapped to prevent moisture absorption. The jaggery caramel is cooked to the perfect crack-stage temperature — not a degree more — to preserve its unrefined mineral richness."
    },
    craftSection: {
      label: "Handcrafted Heritage",
      title: "Your daily energy ritual.",
      description: "Every bar carries the warmth of Kolhapur jaggery, the crunch of toasted millet, and the patience of small-batch craft — a snack rooted in tradition, made for modern life.",
      processingParams: ["Hand Pressed", "Jaggery Bound", "No Refined Sugar"]
    }
  }
];