module.exports = {
  jwt: {
    secret: process.env.JWT_KEY,
    tokens: {
      access:{
        type: 'access',
        expiresIn: 3600
      },
      refresh:{
        type: 'refresh',
        expiresIn: 300
      },
    },
  }
}