const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Profesor = require('../models/Profesor');

exports.register = async (req, res) => {
  const { nombre, correo, contrasena, area } = req.body;
  if (!nombre || !correo || !contrasena || !area) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }
  const existe = await Profesor.findOne({ correo });
  if (existe) return res.status(409).json({ mensaje: 'Ese correo ya está registrado' });

  const hash = await bcrypt.hash(contrasena, 10);
  const profesor = await Profesor.create({ nombre, correo, contrasena: hash, area });

  res.status(201).json({ id: profesor._id, nombre: profesor.nombre, correo: profesor.correo });
};

exports.login = async (req, res) => {
  const { correo, contrasena } = req.body;
  const profesor = await Profesor.findOne({ correo });
  if (!profesor) return res.status(401).json({ mensaje: 'Credenciales inválidas' });

  const valido = await bcrypt.compare(contrasena, profesor.contrasena);
  if (!valido) return res.status(401).json({ mensaje: 'Credenciales inválidas' });

  const token = jwt.sign({ id: profesor._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
};

exports.me = async (req, res) => {
  const profesor = await Profesor.findById(req.profesorId).select('-contrasena');
  if (!profesor) return res.status(404).json({ mensaje: 'Profesor no encontrado' });
  res.json(profesor);
};