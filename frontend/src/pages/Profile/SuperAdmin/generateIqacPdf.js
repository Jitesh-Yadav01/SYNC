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
 * Replicates the GDG reference PDF structure exactly:
 *
 * PAGE 1  – Cover/summary: AIT header, club name, vision/mission,
 *           faculty in-charges, secretaries, budget, numbered event list
 * PAGE 2+ – Per-event pages with a two-column "Required Field / Information"
 *           table, followed by Objectives (●) and "Overview of the Event"
 *
 * Styling: Times New Roman, all-black text, simple black 1pt grid borders,
 *          no colored fills or headers.
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

    const doc = new jsPDF({ unit: 'pt', format: 'letter' }); // 612 × 792 like original
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const MX = 65;   // horizontal margin matching original
    const MR = W - 65;
    const usable = MR - MX; // ~482

    // ── All-black styling (matches original) ─────────────────────────
    const BLACK = [0, 0, 0];

    const setBlack = () => doc.setTextColor(0, 0, 0);

    /** Draw a full-width 1px black line at y */
    const drawLine = (y) => {
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(1);
        doc.line(MX, y, MR, y);
    };

    /** Ensure we don't write past the page. Returns new y (on same or new page). */
    const safeY = (y, needed = 20) => {
        if (y + needed > H - 50) {
            doc.addPage();
            return 50;
        }
        return y;
    };

    // Common table style matching the original: black 1pt borders, no fills
    const tableDefaults = {
        styles: {
            font: 'times',
            fontSize: 11,
            textColor: BLACK,
            cellPadding: { top: 4, bottom: 4, left: 6, right: 6 },
            lineColor: BLACK,
            lineWidth: 1,
            overflow: 'linebreak',
            valign: 'top',
        },
        headStyles: {
            fillColor: false,
            textColor: BLACK,
            fontStyle: 'bold',
            lineColor: BLACK,
            lineWidth: 1,
        },
        bodyStyles: {
            fillColor: false,
        },
        alternateRowStyles: {
            fillColor: false,
        },
        margin: { left: MX, right: W - MR },
        theme: 'grid',
        tableLineColor: BLACK,
        tableLineWidth: 1,
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
        try { doc.addImage(logo, 'JPEG', W / 2 - w / 2, y, w, h); } catch (_) {}
        y += h + 14;
    } else {
        y += 10;
    }

    // College name
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    setBlack();
    doc.text('Army Institute of Technology, Pune', W / 2, y, { align: 'center' });
    y += 24;

    // "REPORT FOR AY ..."
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    setBlack();
    const ayLabel = academicYear || (events[0]?.academicYear ?? '');
    doc.text(`REPORT FOR AY ${ayLabel}`, W / 2, y, { align: 'center' });
    y += 18;

    // Club name
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    setBlack();
    doc.text(clubName, W / 2, y, { align: 'center' });
    y += 22;

    // ── Vision / Mission ─────────────────────────────────────────────
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.text('VISION', MX, y);
    y += 14;
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    const visionText = opts.vision || 'To be an important part of the Government\'s dream of a 5 trillion economy, by contributing through startups of AIT students.';
    const visionLines = doc.splitTextToSize(visionText, usable);
    visionLines.forEach((line) => {
        doc.text(line, MX, y);
        y += 13;
    });
    y += 6;

    doc.setFont('times', 'bold');
    doc.text('MISSION', MX, y);
    y += 14;
    doc.setFont('times', 'normal');
    const missionText = opts.mission || 'To build an ecosystem to identify, nurture innovation and entrepreneurship skills amongst students and to generate successful commercial enterprise contributing towards significant job creations.';
    const missionLines = doc.splitTextToSize(missionText, usable);
    missionLines.forEach((line) => {
        doc.text(line, MX, y);
        y += 13;
    });
    y += 14;

    // ── Faculty in-charges (table) ───────────────────────────────────
    y = safeY(y, 60);
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.text('Name of faculty in-charges', MX, y);
    y += 6;

    const facultyBody = faculty.length
        ? faculty.map((f, i) => [String(i + 1), f])
        : [['1', '']];

    autoTable(doc, {
        startY: y,
        body: facultyBody,
        ...tableDefaults,
        columnStyles: {
            0: { cellWidth: 40, halign: 'center' },
        },
    });
    y = doc.lastAutoTable.finalY + 10;

    // ── Student Secretaries (table) ──────────────────────────────────
    y = safeY(y, 60);
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    setBlack();
    doc.text('Name of Student Secretaries', MX, y);
    y += 6;

    const secBody = secretaries.length
        ? secretaries.map((s, i) => [String(i + 1), s])
        : [['1', '']];

    autoTable(doc, {
        startY: y,
        body: secBody,
        ...tableDefaults,
        columnStyles: {
            0: { cellWidth: 40, halign: 'center' },
        },
    });
    y = doc.lastAutoTable.finalY + 10;

    // ── Budget ───────────────────────────────────────────────────────
    y = safeY(y, 40);
    autoTable(doc, {
        startY: y,
        body: [
            ['Budget Allocated\nby Institute', `Rs ${Number(clubBudget).toLocaleString('en-IN')}`],
            ['Sponsorship received', ''],
        ],
        ...tableDefaults,
        columnStyles: {
            0: { cellWidth: usable / 2, fontStyle: 'bold' },
        },
    });
    y = doc.lastAutoTable.finalY + 14;

    // ── Events summary table ─────────────────────────────────────────
    y = safeY(y, 60);
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    setBlack();
    doc.text('Name of activities/events conducted', MX, y);
    y += 6;

    const summaryHead = [['Sr No.', 'Name of activity', 'Type\n(Inter college/ Intra\ncollege)']];
    const summaryBody = events.map((e, i) => [
        `${i + 1}.`,
        e.title || 'Untitled',
        e.eventType || '—',
    ]);

    autoTable(doc, {
        startY: y,
        head: summaryHead,
        body: summaryBody.length ? summaryBody : [['—', 'No events recorded', '']],
        ...tableDefaults,
        headStyles: {
            ...tableDefaults.headStyles,
            fillColor: false,
        },
        columnStyles: {
            0: { cellWidth: 50, halign: 'center' },
            2: { cellWidth: 140 },
        },
    });

    // ================================================================
    //  PAGE 2+ – ONE PAGE PER EVENT
    // ================================================================

    events.forEach((evt) => {
        doc.addPage();
        let ey = 40;

        // ── Event title ──────────────────────────────────────────────
        doc.setFont('times', 'bold');
        doc.setFontSize(15);
        setBlack();
        const titleText = `EVENT: ${(evt.title || 'Untitled').toUpperCase()}`;
        doc.text(titleText, W / 2, ey, { align: 'center' });
        ey += 22;

        // ── Main details table (two-column: Required Field | Information) ──
        const detailRows = [];

        const addRow = (label, value) => {
            detailRows.push([label, value !== undefined && value !== null && value !== '' && value !== 'Nil' ? String(value) : 'Nil']);
        };

        addRow('Academic Year', evt.academicYear);
        addRow('Program/Activity/Name', evt.title);

        // Event type row with the full label from reference
        addRow('Select one of the Program Types\n(Workshop/ FDP/Seminar/conference/\nintercollege event/ intra-college event/ other)', evt.eventType);
        addRow('Select one of the program themes\n(IPR/Innovation/ Entrepreneurship/\nStartup/Other)', evt.theme);
        addRow('Start Date', evt.startDate);
        addRow('End Date', evt.endDate);
        addRow('Number of Students Participated', evt.studentParticipation);
        addRow('Number of faculty Participated', evt.facultyParticipation);
        addRow('Expenditure Amount, if any', evt.budget ? `Rs ${Number(evt.budget).toLocaleString('en-IN')}` : 'Nil');
        addRow('Remark', 'Nil');

        // Description of activity (numbered items in table, blank line between each)
        if (evt.description?.length && evt.description.some(d => d)) {
            const numberedDesc = evt.description
                .filter(d => d)
                .map((d, i) => `${i + 1}. ${d}`)
                .join('\n\n');
            addRow('Description of activity( 50-150 words)', numberedDesc);
        }

        // Objectives (numbered items in table, blank line between each)
        if (evt.objectives?.length && evt.objectives.some(o => o)) {
            const numberedObj = evt.objectives
                .filter(o => o)
                .map((o, i) => `${i + 1}. ${o}`)
                .join('\n\n');
            addRow('Objective', numberedObj);
        }

        // Faculty involved
        if (faculty.length) {
            addRow('Faculty Name (Faculty involved in\norganizing the event)', faculty.map((f, i) => `${i + 1}. ${f}`).join('\n'));
        }

        // Collaborators
        if (evt.collaborators?.length) {
            addRow('Collaborators', evt.collaborators.join(', '));
        }

        // POs mapped
        if (evt.pos?.length) {
            addRow('Mentioned the POs mapped with\nthe activity', evt.pos.join(', '));
        }

        autoTable(doc, {
            startY: ey,
            head: [['Required Field', 'Information to be filled']],
            body: detailRows,
            ...tableDefaults,
            headStyles: {
                ...tableDefaults.headStyles,
                fillColor: false,
            },
            columnStyles: {
                0: { cellWidth: usable / 2 },
            },
        });

        ey = doc.lastAutoTable.finalY + 12;

        // ── Overview of the Event (outside the table, uses 'overview' field) ──
        if (evt.overview?.length && evt.overview.some(d => d)) {
            ey = safeY(ey, 50);
            doc.setFont('times', 'bold');
            doc.setFontSize(12);
            setBlack();
            doc.text('Overview of the Event:', MX, ey);
            ey += 18;
            doc.setFont('times', 'normal');
            doc.setFontSize(11);
            const filteredOverview = evt.overview.filter(p => p);
            filteredOverview.forEach((para, idx) => {
                ey = safeY(ey, 20);
                const numLabel = `${idx + 1}. `;
                const numWidth = doc.getTextWidth(numLabel);
                doc.text(numLabel, MX, ey);
                const lines = doc.splitTextToSize(para, usable - numWidth);
                lines.forEach((line, li) => {
                    ey = safeY(ey, 14);
                    doc.text(line, MX + numWidth, ey);
                    ey += 13;
                });
                ey += 6;
            });
        }
    });

    // ── Save ─────────────────────────────────────────────────────────
    const safe = clubName.replace(/[^a-z0-9]+/gi, '_');
    doc.save(`${safe}_IQAC_Report.pdf`);
}

export default generateIqacPdf;
