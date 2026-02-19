import { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  getScoreColor, 
  DIAGRAM_OUTER_SEGMENTS, 
  DIAGRAM_VENN_LABELS, 
  DIAGRAM_INTERSECTION_LABELS,
  DIAGRAM_BADGES 
} from '../utils/constants';

const FrameworkDiagram = memo(({ frameworkData, totalScore, size = 'large' }) => {
  const getScore = (categoryId) => {
    const item = frameworkData.find(d => d.categoryId === categoryId);
    return item?.score || 0;
  };

  const width = 500;
  const height = 500;
  const cx = width / 2;
  const cy = height / 2;

  // Outer ring
  const outerRadius = 235;
  
  // Venn circles - 3 large overlapping circles
  const vennRadius = 105;
  const vennSpread = 55;

  // Three Venn circle centers
  const profitsCenter = { x: cx, y: cy - vennSpread };
  const persistenceCenter = { x: cx - vennSpread * 0.9, y: cy + vennSpread * 0.5 };
  const presenceCenter = { x: cx + vennSpread * 0.9, y: cy + vennSpread * 0.5 };

  const strokeColor = '#1a2744';
  const fillColor = '#F5F1E3';
  const bgColor = '#FDFCF7';

  // Get point on outer circle
  const getOuterPoint = (angle) => {
    const rad = (angle - 90) * Math.PI / 180;
    return { x: cx + outerRadius * Math.cos(rad), y: cy + outerRadius * Math.sin(rad) };
  };

  // Get the nearest point on any Venn circle from a given angle
  const getVennBoundaryPoint = (angle) => {
    const rad = (angle - 90) * Math.PI / 180;
    const dirX = Math.cos(rad);
    const dirY = Math.sin(rad);
    
    const circles = [profitsCenter, persistenceCenter, presenceCenter];
    let maxDist = 0;
    let bestPoint = { x: cx, y: cy };
    
    circles.forEach(center => {
      const dx = cx - center.x;
      const dy = cy - center.y;
      const a = dirX * dirX + dirY * dirY;
      const b = 2 * (dx * dirX + dy * dirY);
      const c = dx * dx + dy * dy - vennRadius * vennRadius;
      const disc = b * b - 4 * a * c;
      
      if (disc >= 0) {
        const t = (-b + Math.sqrt(disc)) / (2 * a);
        if (t > 0) {
          const px = cx + t * dirX;
          const py = cy + t * dirY;
          const dist = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);
          if (dist > maxDist) {
            maxDist = dist;
            bestPoint = { x: px, y: py };
          }
        }
      }
    });
    
    return bestPoint;
  };

  // Create segment path with curved inner edge
  const createSegmentPath = (startAngle, endAngle) => {
    const steps = 20;
    const angleStep = (endAngle - startAngle) / steps;
    
    const outerStart = getOuterPoint(startAngle);
    const outerEnd = getOuterPoint(endAngle);
    
    let innerPath = '';
    for (let i = steps; i >= 0; i--) {
      const angle = startAngle + i * angleStep;
      const pt = getVennBoundaryPoint(angle);
      innerPath += (i === steps ? 'L' : ' L') + ` ${pt.x} ${pt.y}`;
    }
    
    const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
    return `M ${outerStart.x} ${outerStart.y} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y} ${innerPath} Z`;
  };

  // Get separator line
  const getSeparatorLine = (angle) => {
    const outer = getOuterPoint(angle);
    const inner = getVennBoundaryPoint(angle);
    return { outer, inner };
  };

  // Label position in middle of segment
  const getLabelPosition = (startAngle, endAngle) => {
    const midAngle = (startAngle + endAngle) / 2;
    const rad = (midAngle - 90) * Math.PI / 180;
    const labelRadius = outerRadius - 20;
    return {
      x: cx + labelRadius * Math.cos(rad),
      y: cy + labelRadius * Math.sin(rad),
      rotation: midAngle
    };
  };

  // Get Venn center by key
  const getVennCenter = (key) => {
    if (key === 'unstoppableOffer') return profitsCenter;
    if (key === 'unstoppableCustomerFlow') return persistenceCenter;
    if (key === 'unstoppableSales') return presenceCenter;
    return { x: cx, y: cy };
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="relative w-full flex items-center justify-center gap-1">
        {/* Left badge */}
        {DIAGRAM_BADGES.filter(b => b.position === 'left').map(badge => (
          <motion.div 
            key={badge.name}
            className="shrink-0 px-2 py-1 bg-[#c8ff00] text-[#1a2744] font-bold text-[10px] rounded shadow-sm"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            {badge.name}
          </motion.div>
        ))}

        {/* SVG Diagram */}
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto flex-1" style={{ maxWidth: size === 'large' ? '380px' : '300px' }}>
          {/* Background fill for Venn area */}
          <circle cx={profitsCenter.x} cy={profitsCenter.y} r={vennRadius} fill={bgColor} />
          <circle cx={persistenceCenter.x} cy={persistenceCenter.y} r={vennRadius} fill={bgColor} />
          <circle cx={presenceCenter.x} cy={presenceCenter.y} r={vennRadius} fill={bgColor} />

          {/* Outer segments with curved inner edges */}
          {DIAGRAM_OUTER_SEGMENTS.map((seg, index) => {
            const score = getScore(seg.id);
            const segmentFill = getScoreColor(score) || fillColor;
            const labelPos = getLabelPosition(seg.startAngle, seg.endAngle);
            
            let textRotation = labelPos.rotation;
            if (textRotation > 90 && textRotation < 270) textRotation += 180;
            
            return (
              <g key={seg.id}>
                <motion.path
                  d={createSegmentPath(seg.startAngle, seg.endAngle)}
                  fill={segmentFill}
                  stroke={strokeColor}
                  strokeWidth={1}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textRotation}, ${labelPos.x}, ${labelPos.y})`}
                  fill={strokeColor}
                  fontWeight="600"
                  fontSize="8"
                >
                  {seg.name}
                </text>
              </g>
            );
          })}

          {/* Separator lines between segments */}
          {DIAGRAM_OUTER_SEGMENTS.map((seg, index) => {
            const line = getSeparatorLine(seg.startAngle);
            return (
              <line
                key={`sep-${index}`}
                x1={line.outer.x}
                y1={line.outer.y}
                x2={line.inner.x}
                y2={line.inner.y}
                stroke={strokeColor}
                strokeWidth={1}
              />
            );
          })}

          {/* Three Venn circles - stroke only */}
          <circle cx={profitsCenter.x} cy={profitsCenter.y} r={vennRadius} fill="none" stroke={strokeColor} strokeWidth={1.5} />
          <circle cx={persistenceCenter.x} cy={persistenceCenter.y} r={vennRadius} fill="none" stroke={strokeColor} strokeWidth={1.5} />
          <circle cx={presenceCenter.x} cy={presenceCenter.y} r={vennRadius} fill="none" stroke={strokeColor} strokeWidth={1.5} />

          {/* Venn circle labels - dynamic from constants */}
          {Object.entries(DIAGRAM_VENN_LABELS).map(([key, label]) => {
            const center = getVennCenter(key);
            if (label.multiline) {
              const lines = label.name.split('\n');
              return (
                <text 
                  key={key}
                  x={center.x + label.offsetX} 
                  y={center.y + label.offsetY} 
                  textAnchor="middle" 
                  fill={strokeColor} 
                  fontWeight="700" 
                  fontSize={label.fontSize}
                >
                  {lines.map((line, i) => (
                    <tspan key={i} x={center.x + label.offsetX} dy={i === 0 ? 0 : label.fontSize + 2}>
                      {line}
                    </tspan>
                  ))}
                </text>
              );
            }
            return (
              <text 
                key={key}
                x={center.x + label.offsetX} 
                y={center.y + label.offsetY} 
                textAnchor="middle" 
                fill={strokeColor} 
                fontWeight="700" 
                fontSize={label.fontSize}
              >
                {label.name}
              </text>
            );
          })}

          {/* Intersection labels - dynamic from constants */}
          {Object.entries(DIAGRAM_INTERSECTION_LABELS).map(([key, label]) => {
            if (label.highlight) {
              return (
                <g key={key}>
                  <rect 
                    x={cx + label.offsetX - 44} 
                    y={cy + label.offsetY - 9} 
                    width="88" 
                    height="18" 
                    rx="3" 
                    fill="#c8ff00" 
                    opacity="0.9" 
                  />
                  <text 
                    x={cx + label.offsetX} 
                    y={cy + label.offsetY + 4} 
                    textAnchor="middle" 
                    fill={strokeColor} 
                    fontWeight="800" 
                    fontSize={label.fontSize}
                  >
                    {label.name}
                  </text>
                </g>
              );
            }
            return (
              <text 
                key={key}
                x={cx + label.offsetX} 
                y={cy + label.offsetY} 
                textAnchor="middle" 
                fill={strokeColor} 
                fontSize={label.fontSize} 
                fontWeight="600"
              >
                {label.name}
              </text>
            );
          })}
        </svg>

        {/* Right badge */}
        {DIAGRAM_BADGES.filter(b => b.position === 'right').map(badge => (
          <motion.div 
            key={badge.name}
            className="shrink-0 px-2 py-1 bg-[#c8ff00] text-[#1a2744] font-bold text-[10px] rounded shadow-sm"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            {badge.name}
          </motion.div>
        ))}
      </div>

      {/* Bottom badge */}
      {DIAGRAM_BADGES.filter(b => b.position === 'bottom').map(badge => (
        <motion.div 
          key={badge.name}
          className="px-2 py-1 bg-[#c8ff00] text-[#1a2744] font-bold text-[10px] rounded shadow-sm mt-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {badge.name}
        </motion.div>
      ))}

      {/* Score */}
      <div className="text-center mt-2">
        <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-widest">Your Framework Score</p>
        <motion.div className="flex items-baseline justify-center gap-1" key={totalScore} initial={{ scale: 1.1 }} animate={{ scale: 1 }}>
          <span className="text-4xl font-display font-bold text-navy">{totalScore}</span>
          <span className="text-lg text-navy/40 font-semibold">/ 100</span>
        </motion.div>
      </div>
    </div>
  );
});

FrameworkDiagram.displayName = 'FrameworkDiagram';

export default FrameworkDiagram;
