import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { seedProducts } from './seedData'

export const addSeedDataToFirebase = async () => {
  try {
    console.log('🌱 Starting to add seed data...')
    let count = 0

    for (const product of seedProducts) {
      await addDoc(collection(db, 'tools'), {
        ...product,
        sellerId: 'admin-seed',
        sellerEmail: 'admin@aistore.com',
        sellerName: 'AIStore Admin',
        createdAt: new Date()
      })
      count++
      console.log(`✅ Added: ${product.name}`)
    }

    console.log(`✨ Successfully added ${count} products to the marketplace!`)
    alert(`✅ Successfully seeded ${count} AI products! Refresh the page.`)
  } catch (error) {
    console.error('❌ Error adding seed data:', error)
    alert('❌ Error adding products. Check console for details.')
  }
}