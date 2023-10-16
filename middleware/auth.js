const register = (req, res, next) => {
    try {
        const { email, password} = req.body
        User.findOne({email}).then(async(user) => {
            if(user) {
                return res.status(400).json({
                    message:"User already exists"
                })
            } else{
                const newUser = await new User({
                    email,
                    password
                })
                newUser.save()
                return res.status(200).json({
                    message: newUser
                })
            }
        })
        
    } catch (err) {
        return res.status(401).json({
            message:"Couldnt create user",
            error:err,
        })
    }
    
}

module.exports = {
    register
}