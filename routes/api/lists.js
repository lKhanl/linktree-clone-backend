const { Router } = require('express');
const auth = require('../../middleware/auth');
// List Model
const List = require('../../models/List');
// User Model
const User = require('../../models/User');

const router = Router();

// list of all lists for authenticated user
router.get('/all', auth, async (req, res) => {
  try {

    const Lists = await List.find({ creator: req.user.id }).select('-links');
    if (!Lists) throw Error('No Lists');

    res.status(200).json(Lists);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {

    // cast string to ObjectId
    const exist = await List.findById(req.params.id);
    if (!exist) return res.status(400).json({ msg: 'List not found' });

    res.status(200).json(exist);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

// create a new list
router.post('/', auth, async (req, res) => {

  const { desc, title } = req.body;

  // Simple validation
  if (!desc || !title) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  const slug = title.toLowerCase().replace(/ /g, '-');

  const newList = new List({
    desc,
    title,
    slug,
    creator: req.user.id
  });

  // unique slug and title
  const exist = await List.findOne({
    $or: [
      { slug },
      { title }
    ],
    creator: req.user.id
  });
  if (exist) return res.status(400).json({ msg: 'List already exists' });

  try {

    const List = await newList.save();
    if (!List) throw Error('Something went wrong saving the List');

    res.status(200).json(List);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

// get a list by userame (public)
router.get('/:username/:title', async (req, res) => {
  try {

    const user = await User.findOne({ username: req.params.username });
    if (!user) throw Error('No user found');

    const list = await List.findOne({ creator: user._id, slug: req.params.title })
      .select('-creator')
      .select('-_id')
      .select('-__v');
    if (!list) throw Error('No List found');

    res.status(200).json(list);

  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

// update a list
router.put('/:listId', auth, async (req, res) => {

  const { desc, title, url } = req.body;

  try {
    const list = await List.findById(req.params.listId);
    if (!list) throw Error('No List found');

    if (desc) list.desc = desc;
    if (title && url && list.links.length <= 5) {
      if (list.links.every(link => link.title !== title)) {
        list.links.push({ title, url });
      } else {
        return res.status(400).json({ msg: 'Link already exists' });
      }
    }

    const updatedList = await list.save();
    if (!updatedList) throw Error('Something went wrong saving the List');

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false });
  }
});

// delete a link from a list
router.delete('/link/:listId/:deleted', auth, async (req, res) => {

  if (!req.params.deleted) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const list = await List.findById(req.params.listId);
    if (!list) throw Error('No List found');

    list.links = list.links.filter(link => link.title !== req.params.deleted);

    const updated = await List.updateOne(list);
    if (!updated)
      throw Error('Something went wrong while trying to update the List');

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false });
  }
});

// delete by id
router.delete('/:id', auth, async (req, res) => {

  console.log(req.params.id);


  if (!req.params.id) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {

    const exist = await List.findById(req.params.id);
    if (!exist) throw Error('No List found');

    const removed = await List.remove();
    if (!removed)
      throw Error('Something went wrong while trying to delete the List');

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false });
  }
});

module.exports = router;
