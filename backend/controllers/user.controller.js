const User = require('../models/User.model'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    }) 
        .catch(error => res.status(500).json({ error }));
}; 

exports.login = (req, res, next) => { 
    User.findOne({ email: req.body.email})
        .then(user => {
            if (user === null ) {
                res.status(401).json({ message: "Pair identifiant/mot de passe incorrecte."})
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message : "Pair identifiant/mot de passe incorrecte."})
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    'TOKEN_SECRET=g$G_fR^%58UgTdPm^n478mp0hv@_7265a$%hdf?40zkjugefvNrf',
                                    { expiresIn: '24h' }
                                ),
                                message : "Token créé !",
                            }); 
                        }
                    })
                    .catch(error => 
                        res.status(500).json({ error })
                    )
            }}
        )
        .catch( error => {
            res.status(500).json( { error })
        })
};