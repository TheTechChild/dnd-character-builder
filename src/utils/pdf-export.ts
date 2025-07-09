import jsPDF from 'jspdf';
import { Character } from '@/types/character';
import { calculateModifier, calculateProficiencyBonus } from './calculations';
import { formatFilename } from './export';

interface CharacterSheetOptions {
  includeSpells?: boolean;
  includeEquipment?: boolean;
  includeNotes?: boolean;
}

export async function exportCharacterToPDF(
  character: Character,
  options: CharacterSheetOptions = {}
): Promise<void> {
  const {
    includeSpells = true,
    includeEquipment = true,
    includeNotes = true,
  } = options;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Set up fonts
  pdf.setFont('helvetica');
  
  // Add character sheet content
  addCharacterHeader(pdf, character);
  addAbilityScores(pdf, character);
  addSkills(pdf, character);
  addCombatStats(pdf, character);
  
  if (includeEquipment && character.equipment && character.equipment.length > 0) {
    pdf.addPage();
    addEquipment(pdf, character);
  }
  
  if (includeSpells && character.spells && Object.keys(character.spells).length > 0) {
    pdf.addPage();
    addSpells(pdf, character);
  }
  
  if (includeNotes && character.notes) {
    pdf.addPage();
    addNotes(pdf, character);
  }

  // Save the PDF
  const filename = formatFilename(character.name, 'pdf');
  pdf.save(filename);
}

function addCharacterHeader(pdf: jsPDF, character: Character): void {
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Title
  pdf.setFontSize(24);
  pdf.text(character.name, pageWidth / 2, 20, { align: 'center' });
  
  // Character details
  pdf.setFontSize(12);
  const details = [
    `Level ${character.level} ${character.race} ${character.class}`,
    character.background ? `Background: ${character.background}` : '',
    character.alignment ? `Alignment: ${character.alignment}` : '',
  ].filter(Boolean).join(' | ');
  
  pdf.text(details, pageWidth / 2, 30, { align: 'center' });
  
  // Divider
  pdf.line(20, 35, pageWidth - 20, 35);
}

function addAbilityScores(pdf: jsPDF, character: Character): void {
  const abilities = [
    { name: 'Strength', value: character.abilities.strength },
    { name: 'Dexterity', value: character.abilities.dexterity },
    { name: 'Constitution', value: character.abilities.constitution },
    { name: 'Intelligence', value: character.abilities.intelligence },
    { name: 'Wisdom', value: character.abilities.wisdom },
    { name: 'Charisma', value: character.abilities.charisma },
  ];
  
  pdf.setFontSize(14);
  pdf.text('Ability Scores', 20, 45);
  
  pdf.setFontSize(10);
  let y = 55;
  
  abilities.forEach((ability) => {
    const modifier = calculateModifier(ability.value);
    const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
    
    pdf.text(`${ability.name}:`, 20, y);
    pdf.text(`${ability.value} (${modifierStr})`, 60, y);
    y += 8;
  });
}

function addSkills(pdf: jsPDF, character: Character): void {
  const proficiencyBonus = calculateProficiencyBonus(character.level);
  
  pdf.setFontSize(14);
  pdf.text('Skills', 120, 45);
  
  pdf.setFontSize(10);
  pdf.text(`Proficiency Bonus: +${proficiencyBonus}`, 120, 55);
  
  // List proficient skills
  const proficientSkills = Object.entries(character.skills)
    .filter(([, skill]) => skill.proficient)
    .map(([skillName]) => skillName);
    
  if (proficientSkills.length > 0) {
    let y = 65;
    pdf.text('Proficiencies:', 120, y);
    y += 8;
    
    proficientSkills.forEach((skill) => {
      pdf.text(`• ${skill}`, 125, y);
      y += 6;
    });
  }
}

function addCombatStats(pdf: jsPDF, character: Character): void {
  const dexModifier = calculateModifier(character.abilities.dexterity);
  
  pdf.setFontSize(14);
  pdf.text('Combat Stats', 20, 120);
  
  pdf.setFontSize(10);
  let y = 130;
  
  const stats = [
    { label: 'Armor Class', value: character.armorClass || (10 + dexModifier) },
    { label: 'Initiative', value: `+${dexModifier}` },
    { label: 'Speed', value: `${character.speed?.base || 30} ft` },
    { label: 'Hit Points', value: `${character.hitPoints.current}/${character.hitPoints.max}` },
    { label: 'Hit Dice', value: character.hitDice.total },
  ];
  
  stats.forEach((stat) => {
    pdf.text(`${stat.label}:`, 20, y);
    pdf.text(String(stat.value), 60, y);
    y += 8;
  });
  
  // Saving throws
  pdf.text('Saving Throws:', 120, 130);
  y = 138;
  
  const savingThrows = Object.entries(character.savingThrows)
    .filter(([, save]) => save.proficient)
    .map(([ability]) => ability);
  
  savingThrows.forEach((save) => {
    pdf.text(`• ${save}`, 125, y);
    y += 6;
  });
}

function addEquipment(pdf: jsPDF, character: Character): void {
  pdf.setFontSize(16);
  pdf.text('Equipment', 20, 20);
  
  pdf.setFontSize(10);
  let y = 35;
  
  character.equipment.forEach((item) => {
    if (y > 270) {
      pdf.addPage();
      y = 20;
    }
    
    pdf.text(`• ${item.name}`, 20, y);
    if (item.quantity > 1) {
      pdf.text(`(x${item.quantity})`, 100, y);
    }
    y += 6;
  });
}

function addSpells(pdf: jsPDF, character: Character): void {
  pdf.setFontSize(16);
  pdf.text('Spells', 20, 20);
  
  // Spell slots
  if (character.spellSlots && Object.keys(character.spellSlots).length > 0) {
    pdf.setFontSize(12);
    pdf.text('Spell Slots:', 20, 35);
    
    pdf.setFontSize(10);
    let x = 20;
    Object.entries(character.spellSlots).forEach(([level, slots]) => {
      if (slots.total > 0) {
        pdf.text(`Level ${level}: ${slots.total}`, x, 45);
        x += 30;
      }
    });
  }
  
  // Spell list
  pdf.setFontSize(12);
  pdf.text('Known Spells:', 20, 60);
  
  pdf.setFontSize(10);
  let y = 70;
  
  const spellsByLevel: Record<string, string[]> = {};
  
  // Group spells by level
  if (character.spells) {
    Object.entries(character.spells).forEach(([level, spellList]) => {
      if (Array.isArray(spellList) && spellList.length > 0) {
        spellsByLevel[level] = spellList;
      }
    });
  }
  
  /*character.spells.reduce((acc, spell) => {
    const level = spell.level || 0;
    if (!acc[level]) acc[level] = [];
    acc[level].push(spell);
    return acc;
  }, {} as Record<number, typeof character.spells>);*/
  
  Object.entries(spellsByLevel).forEach(([level, spells]) => {
    if (y > 260) {
      pdf.addPage();
      y = 20;
    }
    
    pdf.setFontSize(11);
    pdf.text(level === 'cantrips' ? 'Cantrips:' : `Level ${level}:`, 20, y);
    y += 8;
    
    pdf.setFontSize(10);
    spells.forEach((spell) => {
      pdf.text(`• ${spell}`, 25, y);
      y += 6;
    });
    
    y += 4;
  });
}

function addNotes(pdf: jsPDF, character: Character): void {
  if (!character.notes) return;
  
  pdf.setFontSize(16);
  pdf.text('Notes', 20, 20);
  
  pdf.setFontSize(10);
  
  // Split notes into lines that fit on the page
  const lines = pdf.splitTextToSize(character.notes, 170);
  let y = 35;
  
  lines.forEach((line) => {
    if (y > 270) {
      pdf.addPage();
      y = 20;
    }
    pdf.text(line, 20, y);
    y += 6;
  });
}