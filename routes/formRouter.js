const router = require('express').Router();
const auth = require('../middleware/auth');
const formCtrl = require('../controllers/formCtrl');
let Form = require('../models/formModel')

router.route('/').get((req, res)=>{
    console.log("----------------------", req.session.userId)
    Form.find() //get all list in database
        .then(forms => res.json(forms.find({owner:req.session.userId})))
        .catch(err => res.status(400).json('Error : ' + err));
})
router.route('/add').post((req,res)=>{
    const text = req.body.text;
    const type = req.body.type;
    const multiple = req.body.multiple;
    const answer = req.body.answer;
    const owner =req.session.userId;
    

    const newForm = new Form({text,type,multiple,answer,owner})
    console.log(req.session.userId)
    console.log(req.body)

    newForm.save()
        .then(()=> res.json(newForm))
        .then(()=>console.log(newForm))
        .catch(err => {
            console.log("ERROR", err)
            res.status(400).json('Error ' + err)
        })
});

router.route('/:id').get((req,res)=>{
    Form.findById(req.params.id)
        .then(forms => res.json(forms))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req,res)=>{
    Form.findByIdAndDelete(req.params.id)
        .then(()=> res.json('Form deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').put((req,res)=>{
    Form.findById(req.params.id)
        .then(forms => {
            forms.text = req.body.text;
            forms.type = req.body.type;
            forms.answer = req.body.answer;
            forms.multiple= req.body.multiple;

            forms.save()
                .then(()=> res.json('Form Updated'))
                .then(()=>console.log(forms))
                .catch(err => res.status(400).json('Error : '+err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;