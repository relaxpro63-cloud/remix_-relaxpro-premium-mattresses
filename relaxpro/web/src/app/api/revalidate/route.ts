import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { _type } = await req.json()
    if (_type === 'product') revalidateTag('products')
    if (_type === 'home') revalidateTag('home')
    if (_type === 'showroom') revalidateTag('showrooms')
    if (_type === 'siteSettings') revalidateTag('settings')
    if (_type === 'testimonial') revalidateTag('testimonials')
    if (_type === 'faq') revalidateTag('faqs')
    return NextResponse.json({ revalidated: true })
  } catch {
    return NextResponse.json({ revalidated: false }, { status: 400 })
  }
}
