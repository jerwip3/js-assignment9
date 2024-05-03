const router = require("express").Router()
const { ObjectId } = require("mongodb")
const { getCollection } = require("./foodtruck-db")

// GET /api/menu
router.get("/api/menu", async (req, res) => {
    const collection = await getCollection("menu")
    const menu = await collection.find({}).toArray()
    res.json(menu)
})

// GET /api/menu/:id
router.get("/api/menu/:id", async (req, res) => {
    const collection = await getCollection("menu")
    const { id } = req.params
    const menuItem = await collection.findOne({ _id: new ObjectId(id) })
    res.json(menuItem)
})

// POST /api/menu
router.post("/api/menu", async (req, res) => {
    const collection = await getCollection("menu")
    const { name, description, price, imageUrl } = req.body
    await collection.insertOne({ name, description, price, imageUrl })
    res.json({ message: "Menu item created!" })
})

// PUT /api/menu/:id
router.put("/api/menu/:id", async (req, res) => {
    const collection = await getCollection("menu")
    const { id } = req.params
    const { name, description, price, imageUrl } = req.body
    await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { name, description, price, imageUrl } }
    )
    res.json({ message: "Menu item updated!" })
})

// DELETE /api/menu/:id
router.delete("/api/menu/:id", async (req, res) => {
    const collection = await getCollection("menu")
    const { id } = req.params
    await collection.deleteOne({ _id: new ObjectId(id) })
    res.json({ message: "Menu item deleted!" })
})

// GET /api/events
router.get("/api/events", async (req, res) => {
    const collection = await getCollection("events")
    const events = await collection.find({}, { projection: { _id: 1, event: 1, date: 1 } }).toArray()
    res.json(events)
})

// GET /api/events/:id
router.get("/api/events/:id", async (req, res) => {
    const collection = await getCollection("events")
    const { id } = req.params
    const event = await collection.findOne({ _id: new ObjectId(id) })
    res.json(event)
})

// POST /api/events
router.post("/api/events", async (req, res) => {
    const collection = await getCollection("events")
    const { event, location, date, hours } = req.body
    await collection.insertOne({ event, location, date, hours })
    res.json({ message: "Event created!" })
})

// PUT /api/events/:id
router.put("/api/events/:id", async (req, res) => {
    const collection = await getCollection("events")
    const { id } = req.params
    const { event, location, date, hours } = req.body
    await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { event, location, date, hours } }
    )
    res.json({ message: "Event updated!" })
})

// DELETE /api/events/:id
router.delete("/api/events/:id", async (req, res) => {
    const collection = await getCollection("events")
    const { id } = req.params
    await collection.deleteOne({ _id: new ObjectId(id) })
    res.json({ message: "Event deleted!" })
})

module.exports = router