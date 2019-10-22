module.exports = {
  jwt: {
    secret: process.env.JWT_KEY,
    tokens: {
      access:{
        type: 'access',
        expiresIn: '5m'
      },
      refresh:{
        type: 'refresh',
        expiresIn: '10m'
      },
    },
  }
}