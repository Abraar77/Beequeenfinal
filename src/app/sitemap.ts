import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://beequeenofkashmir.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  try {
    const supabase = await createClient();
    const { data: products } = await supabase
      .from("products")
      .select("slug, created_at")
      .order("created_at", { ascending: false });

    const productRoutes: MetadataRoute.Sitemap = (products || []).map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: new Date(p.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
