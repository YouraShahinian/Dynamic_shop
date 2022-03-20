import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies['access_token'] //req.header('Authorization')
        if (!token) {
            return res.redirect('/signin')
        }
        const decoded = jwt.verify(token, 'dynamicshop')
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token, role: 'admin'})

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user

        next()
    } catch (e) {
        // res.status(401).send({ error: 'Please autehticate' })
        res.redirect('/')
    }

}

export default userAuth