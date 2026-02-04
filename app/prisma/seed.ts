import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding demo data...')

  // Create demo user
  const passwordHash = await bcrypt.hash('Demo2024!', 12)

  const user = await prisma.user.upsert({
    where: { email: 'demo@saiv.app' },
    update: {},
    create: {
      email: 'demo@saiv.app',
      passwordHash,
      name: 'Boutique Demo',
      plan: 'GROWTH',
    },
  })

  console.log('Created user:', user.email)

  // Create demo shop
  const shop = await prisma.shop.upsert({
    where: { shopifyDomain: 'demo-boutique.myshopify.com' },
    update: {},
    create: {
      userId: user.id,
      shopifyDomain: 'demo-boutique.myshopify.com',
      shopifyAccessToken: 'demo-token',
      shopName: 'Ma Boutique Demo',
      emailAddress: 'support@demo-boutique.com',
      tone: 'FRIENDLY',
      autoReplyEnabled: true,
      policies: {
        returns: 'Retours acceptés sous 30 jours',
        refunds: 'Remboursement sous 5-7 jours ouvrés',
        shipping: 'Livraison gratuite dès 50€',
      },
      signature: 'L\'équipe Ma Boutique Demo',
    },
  })

  console.log('Created shop:', shop.shopName)

  // Create demo customers
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { shopId_email: { shopId: shop.id, email: 'marie.dupont@email.com' } },
      update: {},
      create: {
        shopId: shop.id,
        email: 'marie.dupont@email.com',
        name: 'Marie Dupont',
        totalOrders: 3,
        totalSpent: 247.50,
      },
    }),
    prisma.customer.upsert({
      where: { shopId_email: { shopId: shop.id, email: 'jean.martin@email.com' } },
      update: {},
      create: {
        shopId: shop.id,
        email: 'jean.martin@email.com',
        name: 'Jean Martin',
        totalOrders: 1,
        totalSpent: 89.99,
      },
    }),
    prisma.customer.upsert({
      where: { shopId_email: { shopId: shop.id, email: 'sophie.bernard@email.com' } },
      update: {},
      create: {
        shopId: shop.id,
        email: 'sophie.bernard@email.com',
        name: 'Sophie Bernard',
        totalOrders: 5,
        totalSpent: 523.00,
      },
    }),
  ])

  console.log('Created', customers.length, 'customers')

  // Create demo orders
  const orders = await Promise.all([
    prisma.order.upsert({
      where: { shopId_shopifyOrderId: { shopId: shop.id, shopifyOrderId: 'order_1001' } },
      update: {},
      create: {
        shopId: shop.id,
        customerId: customers[0].id,
        shopifyOrderId: 'order_1001',
        orderNumber: '#1001',
        status: 'fulfilled',
        fulfillmentStatus: 'shipped',
        trackingNumber: 'LP123456789FR',
        trackingUrl: 'https://www.laposte.fr/outils/suivre-vos-envois?code=LP123456789FR',
        totalPrice: 79.99,
        lineItems: [
          { title: 'T-shirt Premium Noir', quantity: 2, price: 29.99 },
          { title: 'Casquette Logo', quantity: 1, price: 20.01 },
        ],
      },
    }),
    prisma.order.upsert({
      where: { shopId_shopifyOrderId: { shopId: shop.id, shopifyOrderId: 'order_1002' } },
      update: {},
      create: {
        shopId: shop.id,
        customerId: customers[1].id,
        shopifyOrderId: 'order_1002',
        orderNumber: '#1002',
        status: 'paid',
        fulfillmentStatus: 'unfulfilled',
        totalPrice: 89.99,
        lineItems: [
          { title: 'Sweat à Capuche Gris', quantity: 1, price: 89.99 },
        ],
      },
    }),
    prisma.order.upsert({
      where: { shopId_shopifyOrderId: { shopId: shop.id, shopifyOrderId: 'order_1003' } },
      update: {},
      create: {
        shopId: shop.id,
        customerId: customers[2].id,
        shopifyOrderId: 'order_1003',
        orderNumber: '#1003',
        status: 'fulfilled',
        fulfillmentStatus: 'delivered',
        trackingNumber: 'COL987654321FR',
        trackingUrl: 'https://www.colissimo.fr/tracking?code=COL987654321FR',
        totalPrice: 156.00,
        lineItems: [
          { title: 'Veste Hiver Premium', quantity: 1, price: 129.00 },
          { title: 'Écharpe Laine', quantity: 1, price: 27.00 },
        ],
      },
    }),
  ])

  console.log('Created', orders.length, 'orders')

  // Create demo conversations
  const conv1 = await prisma.conversation.create({
    data: {
      shopId: shop.id,
      customerId: customers[0].id,
      orderId: orders[0].id,
      subject: 'Où est ma commande #1001 ?',
      status: 'AUTO_REPLIED',
      type: 'TRACKING',
      messages: {
        create: [
          {
            direction: 'INBOUND',
            sender: 'marie.dupont@email.com',
            content: 'Bonjour,\n\nJ\'ai passé commande il y a 5 jours et je n\'ai toujours rien reçu. Pouvez-vous me dire où en est ma commande #1001 ?\n\nMerci,\nMarie',
            aiGenerated: false,
          },
          {
            direction: 'OUTBOUND',
            sender: 'support@demo-boutique.com',
            content: 'Bonjour Marie,\n\nMerci pour votre message ! J\'ai vérifié votre commande #1001 et j\'ai de bonnes nouvelles.\n\nVotre colis est actuellement en cours de livraison. Voici les détails :\n- Numéro de suivi : LP123456789FR\n- Transporteur : La Poste\n- Statut : En cours de livraison\n\nVous pouvez suivre votre colis ici : https://www.laposte.fr/outils/suivre-vos-envois?code=LP123456789FR\n\nVotre colis devrait arriver d\'ici 1 à 2 jours ouvrés.\n\nN\'hésitez pas si vous avez d\'autres questions !\n\nCordialement,\nL\'équipe Ma Boutique Demo',
            aiGenerated: true,
          },
        ],
      },
    },
  })

  const conv2 = await prisma.conversation.create({
    data: {
      shopId: shop.id,
      customerId: customers[1].id,
      orderId: orders[1].id,
      subject: 'Quand sera expédiée ma commande ?',
      status: 'PENDING',
      type: 'TRACKING',
      messages: {
        create: [
          {
            direction: 'INBOUND',
            sender: 'jean.martin@email.com',
            content: 'Bonjour,\n\nJ\'ai commandé un sweat à capuche il y a 3 jours (commande #1002) mais je n\'ai pas encore reçu de mail d\'expédition. Est-ce normal ?\n\nCordialement,\nJean Martin',
            aiGenerated: false,
          },
        ],
      },
    },
  })

  const conv3 = await prisma.conversation.create({
    data: {
      shopId: shop.id,
      customerId: customers[2].id,
      orderId: orders[2].id,
      subject: 'Demande de retour - Veste trop grande',
      status: 'ESCALATED',
      type: 'RETURN',
      messages: {
        create: [
          {
            direction: 'INBOUND',
            sender: 'sophie.bernard@email.com',
            content: 'Bonjour,\n\nJ\'ai bien reçu ma commande #1003 mais malheureusement la veste est trop grande pour moi. Je voudrais faire un échange pour une taille M au lieu de L.\n\nComment dois-je procéder pour le retour ?\n\nMerci d\'avance,\nSophie Bernard',
            aiGenerated: false,
          },
          {
            direction: 'OUTBOUND',
            sender: 'support@demo-boutique.com',
            content: 'Bonjour Sophie,\n\nJe comprends tout à fait, il arrive que les tailles ne correspondent pas à nos attentes.\n\nBonne nouvelle : nous acceptons les retours sous 30 jours ! Voici la procédure :\n\n1. Renvoyez-nous la veste dans son emballage d\'origine\n2. Joignez une note avec votre numéro de commande #1003 et la nouvelle taille souhaitée (M)\n3. Adresse de retour : 123 Rue du Commerce, 75001 Paris\n\nDès réception, nous vous enverrons la nouvelle taille sous 48h.\n\nNote : Ce dossier a été transmis à notre équipe pour confirmation de stock de la taille M.\n\nCordialement,\nL\'équipe Ma Boutique Demo',
            aiGenerated: true,
          },
        ],
      },
    },
  })

  const conv4 = await prisma.conversation.create({
    data: {
      shopId: shop.id,
      customerId: customers[0].id,
      subject: 'Question sur un produit',
      status: 'RESOLVED',
      type: 'PRODUCT',
      resolvedAt: new Date(),
      messages: {
        create: [
          {
            direction: 'INBOUND',
            sender: 'marie.dupont@email.com',
            content: 'Bonjour,\n\nJe voudrais savoir si le T-shirt Premium est disponible en bleu marine taille S ?\n\nMerci !',
            aiGenerated: false,
          },
          {
            direction: 'OUTBOUND',
            sender: 'support@demo-boutique.com',
            content: 'Bonjour Marie,\n\nOui, le T-shirt Premium est bien disponible en bleu marine taille S ! Vous pouvez le commander directement sur notre site.\n\nJe vous mets le lien direct : [lien vers le produit]\n\nEt en tant que cliente fidèle, voici un code promo de 10% : MERCI10\n\nBonne journée !\nL\'équipe Ma Boutique Demo',
            aiGenerated: true,
          },
          {
            direction: 'INBOUND',
            sender: 'marie.dupont@email.com',
            content: 'Super merci beaucoup ! Je vais commander de suite.',
            aiGenerated: false,
          },
        ],
      },
    },
  })

  console.log('Created 4 demo conversations')

  // Create usage log
  await prisma.usageLog.upsert({
    where: { shopId_month: { shopId: shop.id, month: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
    update: {},
    create: {
      shopId: shop.id,
      month: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      emailsReceived: 127,
      emailsAutoReplied: 98,
      emailsEscalated: 12,
      aiTokensUsed: 45230,
    },
  })

  console.log('Created usage log')

  console.log('\n✅ Demo data seeded successfully!')
  console.log('\n📧 Login credentials:')
  console.log('   Email: demo@saiv.app')
  console.log('   Password: Demo2024!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
