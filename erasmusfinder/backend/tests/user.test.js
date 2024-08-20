const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../src/models/User");
const app = require('../src/index');
const bcrypt = require("bcrypt");

beforeAll(async () => {
  const uri = "mongodb://localhost:27017/testdb";
  await mongoose.connect(uri);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Tests de Usuario", () => {
  // Test de inicio de sesión
  test("Crear un usuario e intentar hacer Log In", async () => {
    const user = new User({
      email: "test@example.com",
      password: await bcrypt.hash("password", 12),
      userName: "testuser",
    });
    await user.save();

    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "test@example.com", password: "password" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.result).toHaveProperty("email", "test@example.com");
  });

  // Test de registro
  test("Registrar un nuevo usuario", async () => {
    const response = await request(app).post("/api/users/signup").send({
      email: "newuser@example.com",
      password: "newpassword",
      userName: "newuser",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.result).toHaveProperty("email", "newuser@example.com");
  });

  // Test de lectura de usuario por ID
  test("Obtener un usuario a través de su ID", async () => {
    const user = await User.create({
      email: "user@example.com",
      password: "password",
      userName: "user",
    });

    const response = await request(app).get(`/api/users/${user._id}`).send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("email", "user@example.com");
  });

  // Test de lectura de usuarios
  test("Obtener todos los usuarios", async () => {
    await User.create({
      email: "user1@example.com",
      password: "password",
      userName: "user1",
    });
    await User.create({
      email: "user2@example.com",
      password: "password",
      userName: "user2",
    });

    const response = await request(app).get("/api/users").send();

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(1);
  });

  // Test de borrado de usuario
  test("Borrar un usuario a través de su id", async () => {
    const user = await User.create({
      email: "deleteuser@example.com",
      password: "password",
      userName: "deleteuser",
    });

    const response = await request(app).delete(`/api/users/${user._id}`).send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Usuario eliminado");

    // Verificar que el usuario ya no está
    const deletedUser = await User.findById(user._id);
    expect(deletedUser).toBeNull();
  });

  // Test de actualización de usuario
  test('Actualizar información de un usuario', async () => {
    const user = await User.create({ email: 'updateuser@example.com', password: 'password', userName: 'updateuser' });

    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .send({ userName: 'updateduser' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Usuario actualizado correctamente');

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.userName).toBe('updateduser');
  });

  // Test de contacto entre usuarios
  test('Establecer contacto entre dos usuarios', async () => {
    const sender = await User.create({ email: 'sender@example.com', password: 'password', userName: 'sender' });
    const receiver = await User.create({ email: 'receiver@example.com', password: 'password', userName: 'receiver' });

    const response = await request(app)
      .post('/api/users/contact')
      .send({ snd: sender._id, rcv: receiver._id });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Contacto establecido correctamente');

    const updatedSender = await User.findById(sender._id);
    const updatedReceiver = await User.findById(receiver._id);

    expect(updatedSender.followedUsers).toContainEqual(receiver._id);
    expect(updatedReceiver.followedUsers).toContainEqual(sender._id);
  });

  // Test de romper contacto
  test('Romper un contacto entre usuarios', async () => {
    const sender = await User.create({ email: 'sender@example.com', password: 'password', userName: 'sender'});
    const receiver = await User.create({ email: 'receiver@example.com', password: 'password', userName: 'receiver'});

    sender.followedUsers.push(receiver._id);
    sender.followingUsers.push(receiver._id);
    receiver.followedUsers.push(sender._id);
    receiver.followingUsers.push(sender._id);
    await sender.save();
    await receiver.save();

    const response = await request(app)
      .post('/api/users/breakcontact')
      .send({ snd: sender._id, rcv: receiver._id });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Contacto eliminado correctamente');

    const updatedSender = await User.findById(sender._id);
    const updatedReceiver = await User.findById(receiver._id);

    expect(updatedSender.followedUsers).not.toContain(receiver._id);
    expect(updatedReceiver.followedUsers).not.toContain(sender._id);
  });

  // Test de enviar solicitud de contacto
  test('Enviar una solicitud de contacto', async () => {
    const sender = await User.create({ email: 'sender@example.com', password: 'password', userName: 'sender'});
    const receiver = await User.create({ email: 'receiver@example.com', password: 'password', userName: 'receiver'});

    const response = await request(app)
      .post('/api/users/sendrequest')
      .send({ snd: sender._id, rcv: receiver._id });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Solicitud de contacto enviada correctamente');

    const updatedSender = await User.findById(sender._id);
    const updatedReceiver = await User.findById(receiver._id);

    expect(updatedSender.pendingContact).toContainEqual(receiver._id);
    expect(updatedReceiver.incomingContactRequest).toContainEqual(sender._id);
  });

  // Test de hacer administrador a un usuario
  test('Designar a un usuario como administrador', async () => {
    const user = await User.create({ email: 'user@example.com', password: 'password', userName: 'user'});

    const response = await request(app)
      .put(`/api/users/makeadmin/${user._id}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Condición de usuario cambiada correctamente');

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.admin).toBe(true);
  });

   // Test para quitar condición administrador a un usuario
   test('Quitar a un usuario el puesto de administrador', async () => {
    const user = await User.create({ email: 'adminuser@example.com', password: 'password', userName: 'adminuser', admin:true});

    const response = await request(app)
      .put(`/api/users/makeadmin/${user._id}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Condición de usuario cambiada correctamente');

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.admin).toBe(false);
  });

  // Test de advertir usuario
  test('Advertir a un usuario de su mal comportamiento', async () => {
    const user = await User.create({ email: 'user@example.com', password: 'password', userName: 'user'});

    const response = await request(app)
      .put(`/api/users/warnuser/${user._id}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Usuario advertido correctamente');

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.warningsN).toBe(1);
  });
});
