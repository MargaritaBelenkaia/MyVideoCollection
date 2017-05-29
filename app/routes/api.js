var User      = require('../models/user');
var Video     = require('../models/video');
var jwt       = require('jsonwebtoken');
var secret    = 'harrypotter';
var bcrypt      = require('bcrypt-nodejs');
module.exports = function(router) { 
    //USER REGISTRATION 
    //localhost:3000/api/users
        router.post('/users', function(req, res){
            var user = new User(req.body);
            if (req.body.name == null || req.body.name == '' || 
                req.body.username == null || req.body.username == ''||
                req.body.password == null || req.body.password == ''||
                req.body.confirm == null || req.body.confirm == '') {
                res.json({ success:false, message:'Please make sure all fields are completed.' });
            } else if (req.body.password != req.body.confirm) {
                res.json({ success:false, message:'Please make sure your paswords are matching.' })
            } else {
                user.save(function(err){
                    if(err) {
                        //check for validation errors
                        if(err.errors != null) {
                            if (err.errors.name) {
                                res.json({ success: false, message: err.errors.name.message });
                            } else if (err.errors.username) {
                                res.json({ success: false, message: err.errors.username.message });
                            } else if (err.errors.password) {
                                res.json({ success: false, message: err.errors.password.message });
                            } else {
                                res.json({ success: false, message: err });
                            }
                        //check for other errors, e.g. duplicating username (code 11000)
                        } else if (err) {
                            if (err.code == 11000) {
                                res.json({ success: false, message: 'This username already exists.' });
                            } else {
                                res.json({ success: false, message: err });
                            }                            
                        }
                    //success message
                    } else {
                    res.json({ success: true, message:'User created!' });
                    }
                });
            }
        });

    //USER LOGIN 
    //localhost:3000/api/authenticate
        router.post('/authenticate', function(req, res){
            User.findOne({ username: req.body.username }).select('name username password confirm').exec(function(err, user) {
                if (err) throw err;

                if( req.body.username == null || req.body.username == ''||
                    req.body.password == null || req.body.password == '') {
                        res.json({ success:false, message:'Please make sure all fields are completed.' });
                    } else if (!user) {
                        res.json({ success: false, message: 'Could not authenticate user.' });
                    } else if (user) {
                        if (req.body.password) {
                            var validPassword = user.comparePassword(req.body.password);
                                if(!validPassword) {
                                    res.json ({ success: false, message: 'Could not authenticate password.' });
                                } else {
                                    var token = jwt.sign ({ name: user.name, username: user.username, expiresIn: '24h' }, secret );
                                    res.json ({ success: true, message: 'User authenticated.', token: token });
                                }
                        } else {
                            res.json ({ success: false, message: 'No password provided.' });
                        }
                    }
            });
        });

        //CHECKING THE USER IS LOGGED IN
        router.use(function(req, res, next) {
            var token = req.body.token || req.body.query || req.headers['x-access-token'];
            if(token) {
                //verify token
                jwt.verify(token, secret, function(err, decoded) {
                    if(err) {
                        res.json ({ success: false, message: 'Token invalid' });
                    } else {
                        req.decoded = decoded;

                        next();
                    }
                });
            } else {
                res.json({ success: false, message: 'No token provided' });
            }
        });

        router.post('/me', function(req, res) {
            res.send(req.decoded);
        });

    //PRE-DELETE CHECK
         router.put('/authenticate', function(req, res) {
            if(req.body.password == null || req.body.password == '') {
                res.json ({ success: false, message: 'Please provide the password' })
            } else {
                var username =  req.decoded.username;
                var user_pass = User.findOne({ username: username } ,function(err, user) {
                    var user_ok = user.comparePassword(req.body.password);
                    if(!user_ok) {
                        res.json ({ success: false, message: 'Could not authenticate password.' });
                    } else {                               
                        res.json ({ success: true, message: 'User varified.'});
                    }
                });    
            }                
        });


    //UPLOAD A VIDEO 
    //localhost:3000/api/videos
        router.post('/videos', function(req, res) {
            var video = new Video(req.body);
            if(req.body.title == null || req.body.title == '' || req.body.category == null || req.body.category == ''|| req.body.link == null || req.body.link == '') {
                res.json({ success: false, message: 'Please make sure the video title, category, and the YouYube link are provided.' });
            } else {
                video.save(function(err) {
                    if (err) {
                        //checking link validation
                        if(err.errors != null) {
                            if(err.errors.link) {
                                res.json({ success: false, message: err.errors.link.message });
                            } else if(err.errors.title) {
                                res.json({ success: false, message: err.errors.title.message });
                            } else if(err.errors.category) {
                                res.json({ success: false, message: err.errors.category.message });
                            } else {
                                res.json({ success: false, message: err });
                            }
                            //check for other errors, e.g. duplicating link (code 11000)
                        } else if(err) {
                            if(err.code == 11000) {
                                res.json({ success: false, message: 'This video is already in the collection' });
                            } else {
                                ({ success: false, message: err });
                            }
                        }
                    //success message
                    } else {
                    res.json({ success: true, message: 'Video uploaded!' }); 
                    }
                });
            }
        });                                        


    //GET THE VIDEOS 
        router.get("/videos", function(req, res) {
            Video.find({}).exec(function(err, videos){
                if(err) {
                    console.log("Error: " + err);
                }
                else {
                    res.send(videos);
                }
            });
        });


    //DELETE A VIDEO 
    router.delete("/videos/:_id", function(req, res){
    Video.remove({_id: req.params._id}, function(err, video){
        if(err) {
            console.log("Error: " + err);
        }
        else {
                res.json({ success: true, message: 'The viseo is no longer in the collection' });
            }
        });
    });

    //EDIT A VIDEO 
    router.put("/videos/:_id", function(req, res){
    Video.findOne({_id: req.params._id}, function(err, video){
        if(err) {
            console.log("Error: " + err);           
        }
        else {
            video.link = req.body.editData;
            video.save(function(err, video) {
                if (err) {
                    res.json({ success: false, message: 'Please make sure it\'s an original YouTube link. Use placehilder as a reference'});
                    return;
                }
                res.json({ success: true, message: 'Video updated!' }); 
            });
        }        
    });
});
       return router;  
}




