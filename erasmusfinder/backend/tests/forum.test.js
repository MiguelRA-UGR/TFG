const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/index");
const Forum = require("../src/models/Forum");
const Destination = require("../src/models/Destination");
const User = require("../src/models/User");

let testUserId;

beforeAll(async () => {
  const uri = "mongodb://localhost:27017/testdb";
  await mongoose.connect(uri);
});

beforeEach(async () => {
  const user = new User({
    userName: "Test",
    email: "test@example.com",
    password: "12345",
  });
  await user.save();
  testUserId = user._id;

  const destination = new Destination({
    name: "Test",
    description: "Test",
    country: "Test",
    coords: { lat: 0, long: 0 },
    population: 100000,
    cost_life: 1000,
    surface: 200,
    iso: "ad",
  });
  await destination.save();

  global.testDestinationId = destination._id.toString();
});

afterEach(async () => {
  //Limpieza de la BD tras las pruebas
  await Forum.deleteMany({});
  await Destination.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Tests de Foros", () => {
  //Test de Creación de un foro
  test("Crear un nuevo foro", async () => {
    const response = await request(app).post("/api/forums").send({
      title: "Test",
      destination: global.testDestinationId,
      description: "Test",
      creator: testUserId,
      url: "http://test.com",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Foro creado");

    const createdForum = await Forum.findOne({ title: "Test" });
    expect(createdForum).toBeTruthy();
    expect(createdForum.title).toBe("Test");

    const destination = await Destination.findById(global.testDestinationId);
    expect(destination.forums).toContainEqual(createdForum._id);
  });

  //Test para lectura de foros
  test("Obtener todos los foros", async () => {
    await Forum.create({
      title: "Forum One",
      destination: global.testDestinationId,
      description: "First forum",
      creator: testUserId,
      url: "http://forumone.com",
    });
    await Forum.create({
      title: "Forum Two",
      destination: global.testDestinationId,
      description: "Second forum",
      creator: testUserId,
      url: "http://forumtwo.com",
    });

    const response = await request(app).get("/api/forums");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(1);
  });

  //Test para lectura de un foro dada su id
  test("Obtener un foro por ID", async () => {
    const forum = await Forum.create({
      title: "Test",
      destination: global.testDestinationId,
      description: "Test",
      creator: testUserId,
      url: "http://test.com",
    });

    const response = await request(app).get(`/api/forums/${forum._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("title", "Test");
  });

  //Test de actualización de un foro
  test("Actualizar un foro", async () => {
    const forum = await Forum.create({
      title: "Test",
      destination: global.testDestinationId,
      description: "Test",
      creator: testUserId, 
      url: "http://test.com",
    });

    const response = await request(app).put(`/api/forums/${forum._id}`).send({
      title: "Updated Forum",
      description: "Updated Description",
      url: "http://updatedforum.com",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Foro actualizado");

    const updatedForum = await Forum.findById(forum._id);
    expect(updatedForum.title).toBe("Updated Forum");
    expect(updatedForum.description).toBe("Updated Description");
    expect(updatedForum.url).toBe("http://updatedforum.com");
  });

  //Test de borrado de un foro
  test("Eliminar un foro", async () => {
    const forum = await Forum.create({
      title: "Test",
      destination: global.testDestinationId,
      description: "Test",
      creator: testUserId,
      url: "http://test.com",
    });

    const response = await request(app).delete(`/api/forums/${forum._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Foro eliminado");

    const deletedForum = await Forum.findById(forum._id);
    expect(deletedForum).toBeNull();

    const destination = await Destination.findById(global.testDestinationId);
    expect(destination.forums).not.toContain(forum._id);
  });
});
