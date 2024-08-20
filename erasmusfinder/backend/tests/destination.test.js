const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/index');
const Destination = require('../src/models/Destination');

var genericDestination;

beforeAll(async () => {
  const uri = "mongodb://localhost:27017/testdb";
  await mongoose.connect(uri);
});

beforeEach(() => {
  genericDestination = {
    name: "Test Destination",
    description: "Test Description",
    country: "Test Country",
    coords: { lat: 10, long: 20 },
    population: 100000,
    cost_life: 1000,
    surface: 200,
    languages: ["English", "Spanish"],
    iso: "ad"
  };
});

afterEach(async () => {
  await Destination.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Tests de Destinos", () => {
  
  // Test de crear un destino
  test("Crear un nuevo destino", async () => {
    const response = await request(app)
      .post("/api/dests")
      .send(genericDestination);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Destino creado");

    const createdDestination = await Destination.findOne({ name: genericDestination.name });
    expect(createdDestination).toBeTruthy();
    expect(createdDestination.name).toBe(genericDestination.name);
  });

  // Test de obtener un destino por ID
  test("Obtener un destino por ID", async () => {
    const destination = new Destination(genericDestination);
    await destination.save();

    const response = await request(app).get(`/api/dests/${destination._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("name", genericDestination.name);
  });

  // Test de actualizar un destino
  test("Actualizar un destino", async () => {
    const destination = new Destination(genericDestination);
    await destination.save();

    const updatedData = {
      name: "Updated Destination",
      description: "Updated description",
    };

    const response = await request(app)
      .put(`/api/dests/${destination._id}`)
      .send(updatedData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Destino actualizado");

    const updatedDestination = await Destination.findById(destination._id);
    expect(updatedDestination.name).toBe(updatedData.name);
    expect(updatedDestination.description).toBe(updatedData.description);
  });

  // Test de eliminar un destino
  test("Eliminar un destino", async () => {
    const destination = new Destination(genericDestination);
    await destination.save();

    const response = await request(app)
      .delete(`/api/dests/${destination._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Destino eliminado");

    const deletedDestination = await Destination.findById(destination._id);
    expect(deletedDestination).toBeNull();
  });

  // Test de obtener todos los destinos
  test("Obtener todos los destinos", async () => {
    await Destination.create(genericDestination);
    await Destination.create({
      ...genericDestination,
      name: "Another Destination",
      iso: "AD"
    });

    const response = await request(app).get("/api/dests");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

});
