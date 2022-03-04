import express from 'express'
const router = new express.Router()
import User from '../models/user.js'
import auth from '../middleware/userAuth.js'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

var db = mongoose.connection
// let urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('', (req, res) => {
    res.render('index')
})

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.get('/signin', (req, res) => {
    res.render('signin')
})

router.get('/users/:id', (req, res) => {
    const _id = req.params.id
    console.log(_id)
    res.render('users')
})

router.get('/message', (req, res) => {
    res.render('message')
})

router.post('/signup', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        // res.status(201).send({ user, token })
        return res.redirect('/message')
    } catch (e) {
        res.status(400).send(e)
    }
})



router.post('/signin', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        //setCookies to res
        res.redirect(`/users/${user._id}`)
    } catch (e) {
        res.status(400).send()
    }
})



router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            // console.log(token,"\n", req.token)
            return token !== req.token
        })
        await req.user.save()
        res.redirect('/')
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    console.log(_id)
    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }
    try {
        // const user = await User.findById(req.params.id)
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/delete', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user) {
        //     return res.status(404).send()
        // }
        await req.user.remove()
        // res.send(req.user)
        return res.redirect('/')
    } catch (e) {
        res.status(500).send()
    }
})




export default router;