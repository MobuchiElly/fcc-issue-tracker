const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test("/api/issues/{project}", function(done){
    chai
        .request(server)
        .post("/api/issues")
        .end((err, res) => {
            assert.equal(res.status, 200)
            
            done()
        });
  });

});
