import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { UserModel as User } from '../models/User'
import { checkPassword, hashPassword } from '../utils/auth'
import slug from 'slug'
import { generateJWT } from '../utils/jwt'
import formidable from 'formidable'
import cloudinary from '../config/cloudinary'
import { v4 as uuid } from 'uuid'

export const createAccount = async (req: Request, res: Response) => {
  const { email, password, handle } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    const error = new Error('El usuario ya está registrado')
    return res.status(409).json({ error: error.message })
  }

  const user = new User(req.body)
  user.password = await hashPassword(password)
  user.handle = slug(handle)

  await user.save()

  res.status(201).send('Registro creado correctamente')
}

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() })
  }

  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    const error = new Error('El usuario no existe')
    return res.status(404).json({ error: error.message })
  }

  const isPasswordCorrect = await checkPassword(password, user.password)

  if (!isPasswordCorrect) {
    const error = new Error('Password incorrecto')
    return res.status(401).json({ error: error.message })
  }

  const token = generateJWT({ id: user._id })
  res.send(token)
}

export const uploadImage = async (req: Request, res: Response) => {
  const form = formidable({ multiples: false })
  form.parse(req, (_error, _fields, files) => {
    cloudinary.uploader.upload(
      files.file[0].filepath,
      { public_id: uuid() },
      async (error, result) => {
        if (error) {
          const error = new Error('Hubo un error al subir la imagen')
          return res.status(500).json({ error: error.message })
        }

        if (result) {
          req.user.image = result.secure_url
          await req.user.save()
          res.json({ image: result.secure_url })
        }
      }
    )
  })

  try {
    console.log('Desde uploadImage')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    const error = new Error('Hubo un error')
    return res.status(500).json({ error: error.message })
  }
}

export const getUser = async (req: Request, res: Response) => {
  res.json(req.user)
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { description } = req.body

    const handle = slug(req.body.handle, '')

    const userExists = await User.findOne({ handle })

    if (userExists && userExists.email !== req.user.email) {
      const error = new Error('nombre de usuario no disponible')
      return res.status(409).json({ error: error.message })
    }

    req.user.description = description
    req.user.handle = handle

    await req.user.save()

    return res.json({ message: 'Perfil actualizado', user: req.user })
  } catch (e) {
    console.error((e as Error).message)
    const error = new Error('Hubo un error')
    return res.status(500).json({ error: error.message })
  }
}
