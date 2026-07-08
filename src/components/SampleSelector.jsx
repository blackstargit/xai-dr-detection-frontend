import { useEffect, useRef } from "react";

function SampleSelector({ onImageSubmit, isLoading }) {
  const canvasRefs = {
    normal: useRef(null),
    moderate: useRef(null),
    severe: useRef(null),
  };

  const drawRetina = (canvas, severity) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    // 1. Draw Fundus Background
    const baseGradient = ctx.createRadialGradient(w/2, h/2, 10, w/2, h/2, w/2);
    baseGradient.addColorStop(0, "#e04e26"); // orange-red center
    baseGradient.addColorStop(0.7, "#a82c11"); // deep red mid
    baseGradient.addColorStop(1, "#540f03"); // dark brown rim
    
    ctx.fillStyle = baseGradient;
    ctx.beginPath();
    ctx.arc(w/2, h/2, w/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // 2. Draw Optic Disc (yellowish-pink nerve exit)
    const opticX = w * 0.3;
    const opticY = h * 0.5;
    const opticRad = w * 0.08;
    const opticGrad = ctx.createRadialGradient(opticX, opticY, 2, opticX, opticY, opticRad);
    opticGrad.addColorStop(0, "#ffefa8");
    opticGrad.addColorStop(0.8, "#fca87c");
    opticGrad.addColorStop(1, "#e04e26");
    
    ctx.fillStyle = opticGrad;
    ctx.beginPath();
    ctx.arc(opticX, opticY, opticRad, 0, Math.PI * 2);
    ctx.fill();

    // 3. Draw Macula (dark spot)
    const maculaX = w * 0.65;
    const maculaY = h * 0.52;
    const maculaGrad = ctx.createRadialGradient(maculaX, maculaY, 2, maculaX, maculaY, w * 0.08);
    maculaGrad.addColorStop(0, "#3d0b02");
    maculaGrad.addColorStop(1, "#a82c11");
    ctx.fillStyle = maculaGrad;
    ctx.beginPath();
    ctx.arc(maculaX, maculaY, w * 0.07, 0, Math.PI * 2);
    ctx.fill();

    // 4. Draw Main Blood Vessels (originating from optic disc)
    ctx.strokeStyle = "#800b00";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const drawVesselBranch = (startX, startY, controlX1, controlY1, controlX2, controlY2, endX, endY) => {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
      ctx.stroke();
    };

    // Upper major temporal arcade
    drawVesselBranch(opticX, opticY, w*0.4, h*0.2, w*0.6, h*0.2, w*0.8, h*0.35);
    // Lower major temporal arcade
    drawVesselBranch(opticX, opticY, w*0.4, h*0.8, w*0.6, h*0.8, w*0.8, h*0.65);
    // Nasal arcade (nasal branches are shorter)
    drawVesselBranch(opticX, opticY, w*0.15, h*0.35, w*0.1, h*0.4, w*0.05, h*0.45);
    drawVesselBranch(opticX, opticY, w*0.15, h*0.65, w*0.1, h*0.6, w*0.05, h*0.55);

    // 5. Draw Pathological Lesions (Severity-dependent)
    if (severity >= 2) {
      // Draw Exudates (bright yellow tiny spots of lipids)
      ctx.fillStyle = "#ffffa0";
      const exudateLocations = [
        [w*0.55, h*0.45], [w*0.58, h*0.42], [w*0.52, h*0.48],
        [w*0.7, h*0.45], [w*0.68, h*0.4], [w*0.72, h*0.43],
        [w*0.6, h*0.6], [w*0.62, h*0.65]
      ];
      exudateLocations.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Microaneurysms (tiny round red dots)
      ctx.fillStyle = "#8a0303";
      const maLocations = [
        [w*0.45, h*0.35], [w*0.5, h*0.32], [w*0.52, h*0.38],
        [w*0.62, h*0.3], [w*0.75, h*0.5], [w*0.78, h*0.55]
      ];
      maLocations.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    if (severity === 4) {
      // Draw Hemorrhages (larger blotches of dark red blood)
      ctx.fillStyle = "#700101";
      const hemLocations = [
        [w*0.42, h*0.32, 4], [w*0.55, h*0.28, 5], [w*0.48, h*0.65, 6],
        [w*0.72, h*0.33, 4], [w*0.82, h*0.48, 5], [w*0.78, h*0.62, 5.5]
      ];
      hemLocations.forEach(([x, y, r]) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Neovascularization (abnormal tangled web of fine capillaries)
      ctx.strokeStyle = "#a30808";
      ctx.lineWidth = 0.8;
      const drawTangledVessel = (x, y) => {
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (let i = 0; i < 6; i++) {
          ctx.lineTo(x + (Math.random() - 0.5) * 12, y + (Math.random() - 0.5) * 12);
        }
        ctx.stroke();
      };
      drawTangledVessel(w * 0.35, h * 0.45);
      drawTangledVessel(w * 0.32, h * 0.55);
      drawTangledVessel(w * 0.45, h * 0.5);
    }
  };

  useEffect(() => {
    drawRetina(canvasRefs.normal.current, 0);
    drawRetina(canvasRefs.moderate.current, 2);
    drawRetina(canvasRefs.severe.current, 4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (refKey, severityName) => {
    if (isLoading) return;
    const canvas = canvasRefs[refKey].current;
    if (!canvas) return;

    // Convert canvas to image file blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `${severityName}_retina_sample.png`, {
          type: "image/png",
        });
        onImageSubmit(file);
      }
    }, "image/png");
  };

  const cases = [
    {
      key: "normal",
      name: "Normal Retina",
      severity: "Severity Level 0",
      color: "var(--color-normal)",
      desc: "Healthy eye. Clear optic disk, macula, and blood vessels without lesions.",
    },
    {
      key: "moderate",
      name: "Moderate DR",
      severity: "Severity Level 2",
      color: "var(--color-moderate)",
      desc: "Early diabetic changes. Visible microaneurysms and hard lipid exudates.",
    },
    {
      key: "severe",
      name: "Severe Proliferative DR",
      severity: "Severity Level 4",
      color: "var(--color-proliferative)",
      desc: "Advanced stages. Ruptured hemorrhages and abnormal neovascular vessels.",
    },
  ];

  return (
    <div style={{ marginTop: "30px", width: "100%", maxWidth: "900px" }}>
      <h3
        style={{
          fontSize: "1.2em",
          fontWeight: "500",
          color: "var(--text-muted)",
          marginBottom: "15px",
          textAlign: "center",
        }}
      >
        Or select a preset clinical test case:
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
          width: "100%",
        }}
      >
        {cases.map((c) => (
          <div
            key={c.key}
            onClick={() => handleSelect(c.key, c.key)}
            style={{
              backgroundColor: "var(--bg-glass)",
              border: "1px solid var(--border-light)",
              borderRadius: "12px",
              padding: "16px",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "var(--transition-smooth)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: isLoading ? 0.6 : 1,
            }}
            className="sample-card"
            onMouseOver={(e) => {
              if (isLoading) return;
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = "var(--border-hover)";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.3)";
            }}
            onMouseOut={(e) => {
              if (isLoading) return;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "var(--border-light)";
              e.currentTarget.style.boxShadow = "none";
            }}
            tabIndex={isLoading ? -1 : 0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSelect(c.key, c.key);
              }
            }}
          >
            <canvas
              ref={canvasRefs[c.key]}
              width={160}
              height={160}
              style={{
                borderRadius: "50%",
                boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
                marginBottom: "15px",
                backgroundColor: "#330800",
              }}
            />
            <h4 style={{ margin: "0 0 4px 0", fontSize: "1.1em", fontWeight: "600" }}>
              {c.name}
            </h4>
            <span
              style={{
                color: c.color,
                fontSize: "0.85em",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "8px",
              }}
            >
              {c.severity}
            </span>
            <p
              style={{
                margin: 0,
                fontSize: "0.85em",
                color: "var(--text-muted)",
                textAlign: "center",
                lineHeight: "1.4",
              }}
            >
              {c.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SampleSelector;
