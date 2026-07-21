import { sanityClient } from './sanity'

export async function getBuilderData() {
  return sanityClient.fetch(`*[_type == "customBuilder"][0]{
    header, sizes, customSize, steps, summaryPanel, ctas, defaults, seo,
    "materials": *[_type=="builderMaterial" && isActive==true] | order(order asc){
      name, "slug": slug.current, slot, brand, density, ild, feelTag, benefit, tooltip,
      thicknessOptions, stackColor, isRecommended, image
    },
    "fabrics": *[_type=="builderFabric" && isActive==true] | order(order asc){
      name, "slug": slug.current, role, gsm, quiltingMm, benefit, addPrice, isRecommended, image
    }
  }`)
}
