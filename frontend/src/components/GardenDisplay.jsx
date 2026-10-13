import React from 'react';

const GardenDisplay = ({ points = 0 }) => {
  let stage = {
    level: 1,
    name: 'Seed',
    icon: '🌱',
    description: "You're starting fresh! Complete habits daily to sprout your garden.",
    minPoints: 0,
    maxPoints: 49,
    nextStage: 'Small Plant',
    targetPoints: 50
  };

  if (points >= 300) {
    stage = {
      level: 4,
      name: 'Mature Garden',
      icon: '🌸',
      description: 'Incredible achievement! Your garden is in full bloom with colorful flowers!',
      minPoints: 300,
      maxPoints: 300,
      nextStage: 'Max Level Reached',
      targetPoints: 300
    };
  } else if (points >= 150) {
    stage = {
      level: 3,
      name: 'Growing Plant',
      icon: '🌳',
      description: 'Awesome work! Your consistency is growing a strong tree.',
      minPoints: 150,
      maxPoints: 299,
      nextStage: 'Mature Garden',
      targetPoints: 300
    };
  } else if (points >= 50) {
    stage = {
      level: 2,
      name: 'Small Plant',
      icon: '🌿',
      description: 'Great start! Your sprout is developing green leaves.',
      minPoints: 50,
      maxPoints: 149,
      nextStage: 'Growing Plant',
      targetPoints: 150
    };
  }

  // Calculate progress percentage to next stage
  const pointsInCurrentStage = points - stage.minPoints;
  const stageRange = stage.targetPoints - stage.minPoints;
  const progressPercent = stage.level === 4 
    ? 100 
    : Math.min(Math.round((pointsInCurrentStage / stageRange) * 100), 100);

  const pointsNeeded = Math.max(stage.targetPoints - points, 0);

  return (
    <div className="garden-box">
      <span className="garden-level-badge">Garden Level {stage.level}: {stage.name}</span>
      <div className="garden-visual-stage">{stage.icon}</div>
      <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
        {stage.description}
      </p>

      <div style={{ maxWidth: '400px', margin: '16px auto 0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span>Points: <strong>{points}</strong></span>
          {stage.level < 4 ? (
            <span>Next: <strong>{stage.nextStage}</strong> ({pointsNeeded} pts away)</span>
          ) : (
            <span>Max Level Achieved! 🏆</span>
          )}
        </div>
        
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default GardenDisplay;
