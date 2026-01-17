const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');
const DeletedAgent = require('../models/DeletedAgent');

// Get all agents
router.get('/', async (req, res) => {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search agents
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    const agents = await Agent.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { mobile: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { agentId: { $regex: q, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single agent
router.get('/:id', async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create agent
router.post('/', async (req, res) => {
  try {
    // Auto-generate agentId if not provided
    if (!req.body.agentId) {
      const lastAgent = await Agent.findOne().sort({ agentId: -1 });
      const maxId = lastAgent && lastAgent.agentId ? parseInt(lastAgent.agentId) : 100000;
      req.body.agentId = (maxId + 1).toString();
    }
    
    const agent = new Agent(req.body);
    const newAgent = await agent.save();
    res.status(201).json(newAgent);
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update agent
router.put('/:id', async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    res.json(agent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete agent (move to bin)
router.delete('/:id', async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    
    const deletedAgent = new DeletedAgent({
      name: agent.name,
      mobile: agent.mobile,
      email: agent.email,
      agentId: agent.agentId,
      companyCode: agent.companyCode,
      caderRole: agent.caderRole,
      address: agent.address,
      originalId: agent._id.toString(),
      createdAt: agent.createdAt
    });
    
    await deletedAgent.save();
    await Agent.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Agent moved to bin' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
