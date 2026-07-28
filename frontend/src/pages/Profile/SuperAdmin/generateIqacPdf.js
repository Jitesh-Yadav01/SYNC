import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const LOGO_SRC = '/aitpune.jpg';

function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
    });
}

/**
 * ── IQAC Report PDF ─────────────────────────────────────────────────
 *
 * Replicates the GDG PDF structure:
 * PAGE 1  – Cover/summary: AIT logo, club name, vision/mission, budget,
 *           faculty, secretaries, and a numbered table of all events
 * PAGE 2+ – One page per event with a key-value table (like the GDG
 *           "Event: FE Induction" pages) followed by a description section.
 *
 * @param {Object} opts
 * @param {string}   opts.clubName
 * @param {number}   opts.clubBudget
 * @param {string[]} opts.faculty          – names of faculty in-charges
 * @param {string[]} opts.secretaries      – names of student secretaries
 * @param {Array}    opts.events           – iqacEvent documents
 * @param {string}   [opts.academicYear]   – fallback academic year label
 */
export async function generateIqacPdf(opts) {
    const {
        clubName = 'Club',
        clubBudget = 0,
        faculty = [],
        secretaries = [],
        events = [],
        academicYear = '',
    } = opts;

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();   // ~595
    const H = doc.internal.pageSize.getHeight();   // ~842
    const MX = 40;  // horizontal margin
    const usable = W - MX * 2;

    // ── Colours ──────────────────────────────────────────────────────
    const DARK  = [17, 24, 39];
    const BLUE  = [29, 78, 216];
    const GRAY  = [75, 85, 99];
    const LGRAY = [245, 246, 248];

    // ── Reusable helpers ─────────────────────────────────────────────
    const center = W / 2;

    const setColor = (c) => doc.setTextColor(c[0], c[1], c[2]);

    /** Draw a full-width 1px line at y */
    const drawLine = (y, color = [200, 200, 200]) => {
        doc.setDrawColor(color[0], color[1], color[2]);
        doc.setLineWidth(0.5);
        doc.line(MX, y, W - MX, y);
    };

    /** Ensure we don't write past the page. Returns new y (on same or new page). */
    const safeY = (y, needed = 60) => {
        if (y + needed > H - 50) {
            doc.addPage();
            return 40;
        }
        return y;
    };

    // ── Load logo ────────────────────────────────────────────────────
    const logo = await loadImage(LOGO_SRC);

    // ================================================================
    //  PAGE 1 – COVER / SUMMARY
    // ================================================================

    let y = 36;

    // Logo
    if (logo && logo.naturalWidth) {
        const h = 64;
        const w = (logo.naturalWidth / logo.naturalHeight) * h;
        try { doc.addImage(logo, 'JPEG', center - w / 2, y, w, h); } catch (_) {}
        y += h + 14;
    } else {
        y += 10;
    }

    // Main title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    setColor(DARK);
    doc.text('Army Institute of Technology, Pune', center, y, { align: 'center' });
    y += 22;

    // Sub-title – "REPORT FOR AY 20XX-XX"
    doc.setFontSize(12);
    setColor(BLUE);
    const ayLabel = academicYear || (events[0]?.academicYear ?? '');
    doc.text(`REPORT FOR AY ${ayLabel}`, center, y, { align: 'center' });
    y += 24;

    drawLine(y);
    y += 14;

    // Club name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    setColor(DARK);
    doc.text(clubName, center, y, { align: 'center' });
    y += 26;

    // ── Vision / Mission (optional static) ───────────────────────────
    // We don't have club-specific vision/mission in the DB, so we skip these
    // and go straight to the info section like in the GDG PDF.

    // ── Faculty in-charges ───────────────────────────────────────────
    if (faculty.length) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        setColor(DARK);
        doc.text('Name of faculty in-charges', MX, y);
        y += 14;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        setColor(GRAY);
        faculty.forEach((f, i) => {
            y = safeY(y, 14);
            doc.text(`${i + 1}.  ${f}`, MX + 10, y);
            y += 13;
        });
        y += 6;
    }

    // ── Student secretaries ──────────────────────────────────────────
    if (secretaries.length) {
        y = safeY(y, 40);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        setColor(DARK);
        doc.text('Name of Student Secretaries', MX, y);
        y += 14;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        setColor(GRAY);
        secretaries.forEach((s, i) => {
            y = safeY(y, 14);
            doc.text(`${i + 1}.  ${s}`, MX + 10, y);
            y += 13;
        });
        y += 6;
    }

    // ── Budget ───────────────────────────────────────────────────────
    y = safeY(y, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    setColor(DARK);
    doc.text('Budget Allocated', MX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`Rs ${Number(clubBudget).toLocaleString('en-IN')}`, MX + 150, y);
    y += 22;

    // ── Events summary table ─────────────────────────────────────────
    y = safeY(y, 60);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    setColor(DARK);
    doc.text('Name of activities/events conducted', MX, y);
    y += 10;

    const summaryBody = events.map((e, i) => [
        String(i + 1),
        e.title || 'Untitled',
        e.eventType || '—',
    ]);

    autoTable(doc, {
        startY: y,
        head: [['Sr No.', 'Name of activity', 'Type']],
        body: summaryBody.length ? summaryBody : [['—', 'No events recorded', '']],
        styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 4, overflow: 'linebreak', lineColor: [200, 200, 200], lineWidth: 0.5 },
        headStyles: { fillColor: DARK, textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: LGRAY },
        margin: { left: MX, right: MX },
        theme: 'grid',
        columnStyles: {
            0: { cellWidth: 45, halign: 'center' },
            2: { cellWidth: 120 },
        },
    });

    // ================================================================
    //  PAGE 2+ – ONE PAGE PER EVENT
    // ================================================================

    events.forEach((evt) => {
        doc.addPage();
        let ey = 36;

        // ── Event title bar ──────────────────────────────────────────
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        setColor(BLUE);
        doc.text(`EVENT: ${(evt.title || 'Untitled').toUpperCase()}`, center, ey, { align: 'center' });
        ey += 18;

        drawLine(ey);
        ey += 14;

        // ── Key-value details table (mirrors GDG format) ─────────────
        const rows = [];

        const addRow = (label, value) => {
            if (value !== undefined && value !== null && value !== '' && value !== 'Nil') {
                rows.push([label, String(value)]);
            }
        };

        addRow('Academic Year', evt.academicYear);
        addRow('Program/Activity Name', evt.title);
        addRow('Event Type', evt.eventType);
        addRow('Theme', evt.theme);
        addRow('Start Date', evt.startDate);
        addRow('End Date', evt.endDate);
        addRow('Student Participants', evt.studentParticipation);
        addRow('Faculty Participated', evt.facultyParticipation);
        addRow('Budget / Expenditure', evt.budget ? `Rs ${Number(evt.budget).toLocaleString('en-IN')}` : 'Nil');
        if (evt.collaborators?.length) {
            addRow('Collaborators', evt.collaborators.join(', '));
        }
        if (evt.pos?.length) {
            addRow('POs Mapped', evt.pos.join(', '));
        }

        autoTable(doc, {
            startY: ey,
            body: rows,
            styles: {
                font: 'helvetica',
                fontSize: 9,
                cellPadding: 5,
                overflow: 'linebreak',
                lineColor: [200, 200, 200],
                lineWidth: 0.5,
            },
            columnStyles: {
                0: { cellWidth: 160, fontStyle: 'bold', fillColor: [240, 240, 240] },
            },
            margin: { left: MX, right: MX },
            theme: 'grid',
        });

        ey = doc.lastAutoTable.finalY + 16;

        // ── Objectives section ───────────────────────────────────────
        if (evt.objectives?.length && evt.objectives.some(o => o)) {
            ey = safeY(ey, 50);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            setColor(DARK);
            doc.text('Objectives', MX, ey);
            ey += 14;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            setColor(GRAY);
            evt.objectives.forEach((obj) => {
                if (!obj) return;
                ey = safeY(ey, 14);
                const lines = doc.splitTextToSize(`• ${obj}`, usable - 20);
                lines.forEach((line) => {
                    ey = safeY(ey, 13);
                    doc.text(line, MX + 10, ey);
                    ey += 12;
                });
            });
            ey += 6;
        }

        // ── Description / Overview ───────────────────────────────────
        if (evt.description?.length && evt.description.some(d => d)) {
            ey = safeY(ey, 50);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            setColor(DARK);
            doc.text('Overview of the Event', MX, ey);
            ey += 14;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            setColor(GRAY);
            evt.description.forEach((para) => {
                if (!para) return;
                const lines = doc.splitTextToSize(para, usable - 10);
                lines.forEach((line) => {
                    ey = safeY(ey, 13);
                    doc.text(line, MX + 5, ey);
                    ey += 12;
                });
                ey += 4;
            });
        }
    });

    // ── Page numbers footer ──────────────────────────────────────────
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${totalPages}`, center, H - 20, { align: 'center' });
        doc.text('Army Institute of Technology, Pune', MX, H - 20);
    }

    const safe = clubName.replace(/[^a-z0-9]+/gi, '_');
    doc.save(`${safe}_IQAC_Report.pdf`);
}

export default generateIqacPdf;
