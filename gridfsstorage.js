/* const storage = (dbURI, fileName) => {
    return new GridFsStorage({
        url: dbURI,
        file: (req, file) => {
            return new Promise((resolve, reject) => {
                crypto.randomBytes(16, (err, buf) => {

                    if (err) return reject(err)

                    const fileInfo = {
                        filename: fileName,
                        bucketName: 'uploads'
                    }
                    resolve(fileInfo)
                })
            })
        }
    })
} */

module.exports = {
    storage
}
