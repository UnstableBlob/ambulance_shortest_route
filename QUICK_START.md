# 🚀 Quick Start Guide
## Ambulance Shortest Route Planner

Get up and running in 5 minutes!

---

## ⚡ Installation (30 seconds)

```bash
# 1. Navigate to project
cd aoa_project

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Visit: http://localhost:3000
```

✅ **That's it!** Your app is now running.

---

## 🎯 First Steps (2 minutes)

### Step 1: Explore the Sample Graph

When you first open the app, you'll see a pre-loaded sample graph with 6 nodes (A-F) connected by edges.

- **Blue Star (🚑)**: Ambulance at Node A
- **Green Diamond (🏥)**: Hospital at Node F
- **Green Path**: Shortest route calculated automatically

### Step 2: Edit an Edge

1. **Click on any edge** (the line between two nodes)
2. A modal will pop up
3. **Change the weight** (try different values like 10 or -2)
4. Click **"💾 Save Changes"**
5. Watch the path recalculate instantly!

### Step 3: Block a Road

1. Click on the edge between **Node D** and **Node E**
2. Toggle **"Block this road"** ON
3. Save the changes
4. See the path find an alternate route!

### Step 4: Add Your Own Nodes

1. Click **"➕ Add Node"** in the Control Panel
2. A new node appears
3. Click **"🔗 Add Edge"** to connect it
4. Drag nodes around to reposition them

---

## 🎓 Key Features to Try

### 1. **Change Start/End Points**
- Use the dropdowns in Control Panel
- Select different ambulance and hospital nodes
- Path updates automatically

### 2. **Add a Toll Road (Negative Weight)**
- Click any edge
- Set weight to a negative number (e.g., -3)
- Watch algorithm switch to Bellman-Ford
- See total cost reduce!

### 3. **Manual Algorithm Selection**
- Scroll to "Algorithm Selection" panel
- Toggle **"Automatic Detection"** OFF
- Choose Dijkstra or Bellman-Ford manually

### 4. **View Route Details**
- Check the right panel for:
  - Total distance
  - Step-by-step path
  - Edge costs

---

## 🎨 Understanding the Colors

### Nodes
| Color | Shape | Meaning |
|-------|-------|---------|
| 🔵 Blue | Star | Ambulance (Start) |
| 🟢 Green | Diamond | Hospital (End) |
| ⚫ Gray | Circle | Normal Intersection |

### Edges (Roads)
| Color | Style | Meaning |
|-------|-------|---------|
| 🟢 Green | Solid | Shortest Path |
| 🟠 Orange | Solid | Toll Road (Negative Weight) |
| 🔴 Red | Dashed | Blocked Road |
| ⚫ Gray | Solid | Normal Road |

---

## 📋 Common Tasks

### Create a Simple Network
```
1. Click "🗑️ Clear All" (top right)
2. Click "➕ Add Node" 3 times
3. Click "🔗 Add Edge" 2 times
4. Set Node N1 as ambulance
5. Set Node N3 as hospital
6. View the calculated path!
```

### Test Different Scenarios

**Scenario A: Direct Route**
- Connect ambulance directly to hospital
- Should show single-edge path

**Scenario B: Blocked Route**
- Create path with multiple routes
- Block the shortest one
- See it find alternate path

**Scenario C: Toll Benefits**
- Add edge with weight -5
- See if path uses toll to reduce cost
- Check Bellman-Ford is active

---

## 💾 Saving Your Work

**Automatic Save:**
- Your graph is saved automatically to browser storage
- Refresh the page - your work persists!

**Reset:**
- Click **"🔄 Load Sample"** to restore demo graph
- Click **"🗑️ Clear All"** to start fresh

---

## 🐛 Troubleshooting

### Issue: Graph Not Showing
**Solution:** Refresh the page (Ctrl+R or Cmd+R)

### Issue: Can't Add Edge
**Solution:** You need at least 2 nodes. Click "➕ Add Node" first.

### Issue: No Path Found
**Solution:** Check if:
- Ambulance and hospital are selected
- Nodes are connected (not isolated)
- No roads blocking the only path

### Issue: Algorithm Warning
**Solution:** This is normal! If you have negative weights, the app automatically uses Bellman-Ford.

---

## 🎯 Challenge Yourself!

### Beginner Challenges
1. ✅ Create a graph with 5 nodes
2. ✅ Add at least 6 edges
3. ✅ Find the shortest path between any two nodes
4. ✅ Block a road and see path change

### Intermediate Challenges
1. ✅ Create a graph where blocking one edge doubles the path length
2. ✅ Add a toll that reduces total cost by 50%
3. ✅ Create a network with 3 different paths between start and end

### Advanced Challenges
1. ✅ Design a network where Dijkstra gives wrong answer (use negative weights)
2. ✅ Create a graph with 10+ nodes representing a real city layout
3. ✅ Find a scenario where the toll road is NOT chosen despite negative weight

---

## 📚 Learn More

### Algorithms
- **Dijkstra:** Fastest for positive weights only
- **Bellman-Ford:** Slower but handles negative weights

### When to Use Each
- **Use Dijkstra:** Normal roads with distance/time
- **Use Bellman-Ford:** Roads with tolls or cost reductions

### Graph Theory Concepts
- **Node:** Intersection or location
- **Edge:** Road or connection
- **Weight:** Distance, time, or cost
- **Path:** Sequence of connected edges

---

## 🎉 You're Ready!

Congratulations! You now know the basics of:
- ✅ Graph visualization
- ✅ Pathfinding algorithms
- ✅ Interactive editing
- ✅ Real-time calculations

**Next Steps:**
1. Create your own complex network
2. Test different scenarios
3. Learn about the algorithms (check TECHNICAL_DOCS.md)
4. Customize the code to add new features!

---

## 💡 Tips & Tricks

### Productivity Tips
- **Double-click edges** for quick editing
- **Drag nodes** to organize your graph
- **Use quick presets** in edge editor for common values
- **Watch the legend** to remember what colors mean

### Power User Features
- **LocalStorage:** Your work saves automatically
- **Sample graph:** Great starting point for learning
- **Algorithm auto-detection:** Removes guesswork
- **Real-time updates:** No need to click "calculate"

---

## 🆘 Need Help?

### Documentation
- 📖 **PROJECT_README.md** - Comprehensive overview
- 🔧 **TECHNICAL_DOCS.md** - Deep technical details
- 🎓 **This guide** - Quick start walkthrough

### Code Structure
```
/app
  ├── page.jsx              ← Main application
  ├── components/           ← UI components
  └── utils/                ← Algorithms
      ├── dijkstra.js
      └── bellmanFord.js
```

---

## 🚀 Ready to Build?

Start experimenting and have fun with graph theory!

**Happy pathfinding! 🚑🏥**

---

*Last Updated: October 13, 2025*
*Version: 1.0.0*
