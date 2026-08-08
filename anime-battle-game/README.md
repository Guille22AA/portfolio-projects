# Anime Battle Game

A turn-based combat game where you choose one of 4 anime characters and battle against a randomly selected CPU-controlled opponent.

## 🎮 How to Play

### Gameplay Overview

- Select a character from a roster of 4 anime fighters
- Battle against a CPU opponent in turn-based combat
- First character to reach 0 HP loses
- Combat progresses in rounds, one ability per turn

### Character Stats & Abilities

Each character has:

- **Base Statistics** - Health, Attack, Mana, Speed
- **4 Unique Abilities** - Each costs a specific amount of mana
- **1 Ultimate Ability** - Special power usable only once per battle
- **Basic Attack** - Can always be used (costs no mana)

### Battle Mechanics

- **Turn Order**: Character with highest Speed acts first
- **Mana Management**: Abilities consume mana. Without mana, only basic attacks are available
- **Speed Variation**: Some abilities grant temporary speed bonuses or apply slow effects to opponents

### Ability Effects

| Effect             | Description                                                      |
| ------------------ | ---------------------------------------------------------------- |
| **Slow**           | Reduces opponent's speed for the next turn                       |
| **Shield**         | Blocks a portion of incoming damage from opponent's next ability |
| **Heal**           | Restores health (cannot exceed maximum HP)                       |
| **Speed Bonus**    | Grants temporary speed increase until next turn                  |
| **Damage Bonus**   | Applies extra damage based on opponent's base attack             |
| **Execute**        | Deals damage based on opponent's missing health percentage       |
| **Steal Ultimate** | Use opponent's Ultimate ability as if it were your own           |

## 🚀 How to Run

### Option 1: Execute JAR

```bash
java -jar anime-battle-game.jar
```

### Option 2: Run from Source

Import the project into Eclipse and execute `main_menu.java`

## 📁 Project Structure

anime-battle-game/
├── src/ - Java source code
├── doc/ - Javadoc documentation
├── anime-battle-game.jar - Runnable executable
└── README.md

## 📚 Main Classes

- **main_menu.java** - Entry point, character selection screen
- **arena_combate.java** - Core combat system and game logic

## 📖 Documentation

[**View Full Javadoc Documentation →**](https://htmlpreview.github.io/?https://github.com/Guille22AA/portfolio-projects/blob/main/anime-battle-game/doc/index.html)

Full API documentation including all classes, packages, and methods.

## 🎯 Objective

Defeat your opponent by managing your character's mana pool strategically, timing your abilities effectively, and leveraging special effects to gain the upper hand.

---

**Language**: Game is in Spanish | **Built with**: Java
