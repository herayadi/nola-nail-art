import "dotenv/config";
import { prisma } from "../src/lib/prisma";           // ← Menggunakan central prisma di src/lib
import { services, mockPortfolio, testimonials, faqs } from '../src/data/dummyData'

console.log("ENV:", process.env.DATABASE_URL);

async function main() {
  console.log('🌱 Memulai proses seeding database...')

  // 1. Membersihkan data lama
  await prisma.addon.deleteMany()
  await prisma.faq.deleteMany()        // sesuaikan dengan nama model di schema.prisma
  await prisma.service.deleteMany()
  await prisma.portfolio.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.timeSlot.deleteMany()

  console.log('🧹 Tabel sudah dibersihkan.')

  // 2. Portfolio
  for (const item of mockPortfolio) {
    await prisma.portfolio.create({
      data: {
        title: item.title,
        category: item.category,
        imageUrl: item.img,
      }
    })
  }
  console.log(`✅ Berhasil seeding ${mockPortfolio.length} Portfolio`)

  // 3. Testimonials
  for (const t of testimonials) {
    await prisma.testimonial.create({
      data: {
        name: t.name,
        service: t.service,
        rating: t.rating,
        text: t.text,
        imageUrl: t.img,
      }
    })
  }
  console.log(`✅ Berhasil seeding ${testimonials.length} Testimonial`)

  // 4. General FAQs
  for (const faq of faqs) {
    await prisma.faq.create({           // ← Perhatikan huruf besar/kecil
      data: {
        question: faq.question,
        answer: faq.answer,
      }
    })
  }
  console.log(`✅ Berhasil seeding ${faqs.length} General FAQ`)

  // 5. Services + nested relations
  for (const s of services) {
    await prisma.service.create({
      data: {
        id: s.id,
        name: s.name,
        description: s.description,
        shortDescription: s.shortDescription,
        price: s.price,
        duration: s.duration,
        image: s.image,
        category: s.category,
        isPopular: s.isPopular || false,
        addons: {
          create: s.addons?.map(a => ({
            name: a.name,
            price: a.price
          })) || []
        },
        faqs: {
          create: s.faqs?.map(f => ({
            question: f.question,
            answer: f.answer
          })) || []
        }
      }
    })
  }

  // 6. Time Slots (New)
  const slots = ["09:00", "10:30", "13:00", "15:00", "16:30", "18:00"]
  for (const slot of slots) {
    await prisma.timeSlot.create({
      data: { time: slot }
    })
  }
  console.log(`✅ Berhasil seeding ${slots.length} Time Slots`)

  console.log('🎉 Seeding database SQLite selesai!')
}

main()
  .catch((e) => {
    console.error('❌ Gagal menjalankan Seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })