const jwt = require('jsonwebtoken');

const auth = async()=>{
    try {
        const token = req.headers.Authorization.split("")[1];
        const customAuth = token.lenght < 500;

        let decodedData;

        if(token && isCustomAuth){
            decodedData = jwt.verify(token, 'test');

            req._id = decodedData?.indexOf;
        }else{
            //GoogleAuth

            decodedData = jwt.decode(token);

            req.userId = decodedData?.sub;
        }

        next();

    } catch (error) {
        console.log(error);
    }
}

module.exports = auth;