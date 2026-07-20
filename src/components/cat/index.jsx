import React from 'react';

// Pixel-art cats perched on the terminal's corner, ported from the
// cat-terminal prototype (recovered/cat-terminal-prototype.html).
//
// Two skeletons — drawResident (front-facing, symmetric, for whoever is
// stationary at "home") and drawCat (side-profile walking, for whoever is in
// motion) — are shared by both characters via getPalette(kind), so the pose
// follows the action, not a fixed per-cat identity. Fixed "fur" palettes
// (not theme-tokened) since a cat's colour is its own material, not UI chrome.
// Click the cat (or press Space) to pet it.
const Cat = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext) return undefined;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const PX = 2;
    let cssW = 0;
    let cssH = 0;

    // shared skeleton — both cats use identical proportions.
    // chibi on purpose: an oversized head on a small body reads as cute at
    // this scale — a realistic head/body ratio just looks like a rodent in
    // 2px pixel art.
    const BODY_HALF_W = 12;
    const BODY_HALF_H = 8;
    // wider than tall — a British Shorthair's round, chubby-cheeked face
    const HEAD_HALF_W = 17;
    const HEAD_HALF_H = 12;
    const LEG_W = 5;
    const LEG_LEN = 7;

    const RESIDENT = {
      outline: 'oklch(19% 0.03 40)',
      body: 'oklch(87% 0.035 70)',
      point: 'oklch(32% 0.09 45)',
      eye: 'oklch(58% 0.11 250)',
      nose: 'oklch(66% 0.11 20)',
    };
    const HEART = 'oklch(62% 0.19 15)';

    const FISH = {
      outline: 'oklch(24% 0.03 240)',
      body: 'oklch(74% 0.06 220)',
      belly: 'oklch(83% 0.08 75)',
      eye: 'oklch(20% 0.02 240)',
    };

    const FRIEND_PALETTES = {
      ginger: {
        fur: 'oklch(66% 0.16 45)',
        stripe: 'oklch(50% 0.15 40)',
        outline: 'oklch(30% 0.07 40)',
        eye: 'oklch(70% 0.15 130)',
        nose: 'oklch(66% 0.11 20)',
      },
      tuxedo: {
        fur: 'oklch(23% 0.015 260)',
        white: 'oklch(96% 0.008 90)',
        outline: 'oklch(11% 0.01 260)',
        eye: 'oklch(81% 0.16 95)',
        nose: 'oklch(68% 0.10 20)',
      },
    };

    let cx = 0;
    let baseY = 0;
    let residentHeadX = 0;
    let residentHeadY = 0;

    const snap = (v) => Math.round(v / PX) * PX;

    function fillEllipse(color, ccx, ccy, halfW, halfH) {
      ctx.fillStyle = color;
      const rows = halfH * 2;
      for (let i = 0; i <= rows; i++) {
        const t = (i - halfH) / halfH;
        if (t < -1 || t > 1) continue;
        const w = halfW * Math.sqrt(1 - t * t);
        if (w < 0.5) continue;
        const y = snap(ccy - halfH + i);
        ctx.fillRect(snap(ccx - w), y, snap(w * 2), PX);
      }
    }

    // pixel fish — the thing every visitor is actually here for. y is its
    // vertical center, not a ground line, so it can be placed either resting
    // on the ground or held up in a mouth
    function drawFish(x, y) {
      fillEllipse(FISH.outline, x, y, 11, 6);
      fillEllipse(FISH.body, x, y, 10, 5);
      ctx.fillStyle = FISH.belly;
      ctx.fillRect(snap(x - 6), snap(y + 1), 8, 3);
      ctx.fillStyle = FISH.outline;
      ctx.fillRect(snap(x - 17), snap(y - 4), 7, 10);
      ctx.fillStyle = FISH.body;
      ctx.fillRect(snap(x - 15), snap(y - 2), 4, 7);
      ctx.fillStyle = FISH.eye;
      ctx.fillRect(snap(x + 6), snap(y - 2), 3, 3);
    }

    // approximate head position for a character at x — used to land claw
    // marks and the fish prop in the right place without duplicating the
    // full skeleton math
    function frontHeadPos(x) {
      const bodyCY = baseY - LEG_LEN - BODY_HALF_H;
      return { x, y: bodyCY - BODY_HALF_H - HEAD_HALF_H + 3 };
    }
    function sideHeadPos(x, facing) {
      const bodyCY = baseY - LEG_LEN - BODY_HALF_H;
      return {
        x: x + facing * (BODY_HALF_W - 1),
        y: bodyCY - BODY_HALF_H - HEAD_HALF_H + 3,
      };
    }

    // symmetric face — two ears, two eyes, centered nose — shared by both
    // cats so a walking friend still looks at you, not off to one side
    function drawFace(headCX, headCY, o) {
      const earTop = headCY - HEAD_HALF_H - 4;
      const earL = headCX - 12;
      const earR = headCX + 12;
      ctx.fillStyle = o.earColor;
      ctx.fillRect(snap(earL - 4), snap(earTop + (o.earTwitch ? -3 : 0)), 9, 8);
      ctx.fillRect(snap(earR - 4), snap(earTop), 9, 8);
      ctx.fillStyle = o.outline;
      ctx.fillRect(snap(earL - 4), snap(earTop + (o.earTwitch ? -3 : 0)), 9, 1);
      ctx.fillRect(snap(earR - 4), snap(earTop), 9, 1);

      // cheeks — the wide, jowly fullness a Shorthair face is known for
      fillEllipse(o.headColor, headCX - 10, headCY + 4, 6, 5);
      fillEllipse(o.headColor, headCX + 10, headCY + 4, 6, 5);

      const eyeL = headCX - 8;
      const eyeR = headCX + 8;
      const eyeY = headCY - 1;
      if (o.expression === 'sneer') {
        // narrowed, angled glare — a V-shaped scowl
        ctx.fillStyle = o.outline;
        ctx.fillRect(snap(eyeL - 4), snap(eyeY + 3), 4, 1);
        ctx.fillRect(snap(eyeL), snap(eyeY + 1), 4, 1);
        ctx.fillRect(snap(eyeR), snap(eyeY + 1), 4, 1);
        ctx.fillRect(snap(eyeR - 4), snap(eyeY + 3), 4, 1);
        ctx.fillStyle = o.eyeColor;
        ctx.fillRect(snap(eyeL - 1), snap(eyeY + 1), 3, 1);
        ctx.fillRect(snap(eyeR - 2), snap(eyeY + 1), 3, 1);
      } else if (o.eyesOpen) {
        ctx.fillStyle = o.eyeColor;
        ctx.fillRect(snap(eyeL - 3), snap(eyeY), 5, 5);
        ctx.fillRect(snap(eyeR - 3), snap(eyeY), 5, 5);
      } else {
        ctx.fillStyle = o.outline;
        ctx.fillRect(snap(eyeL - 3), snap(eyeY + 3), 5, 2);
        ctx.fillRect(snap(eyeR - 3), snap(eyeY + 3), 5, 2);
      }
      ctx.fillStyle = o.noseColor;
      ctx.fillRect(snap(headCX - 2), snap(headCY + 7), 4, 4);
    }

    // side-profile walking skeleton — head at the facing end, tail at the
    // opposite end, four legs hanging between — for whichever cat is
    // currently in motion. The face drawn on that head is always the
    // symmetric front-facing one, so it still looks at the viewer.
    function drawCat(o) {
      const facing = o.facing || 1;
      const bodyHalfW = BODY_HALF_W + (o.stretch ? 3 : 0);
      const bodyHalfH = BODY_HALF_H - (o.stretch ? 1 : 0);
      const bodyCX = o.x;
      const bodyCY = o.groundY - LEG_LEN - bodyHalfH + (o.bob || 0);
      const headCX =
        bodyCX + facing * (bodyHalfW - 1) + facing * (o.headLunge || 0);
      const headCY = bodyCY - bodyHalfH - HEAD_HALF_H + 3 + (o.headDrop || 0);
      const tailBaseX = bodyCX - facing * (bodyHalfW + 2);
      const tailBaseY = bodyCY + 2;

      const legLifts = o.legLifts || [0, 0, 0, 0];
      const legDX = [
        bodyHalfW - 3,
        bodyHalfW - 7,
        -(bodyHalfW - 7),
        -(bodyHalfW - 3),
      ];
      const legX = [];
      const legY = [];
      let li;
      for (li = 0; li < 4; li++) {
        legX[li] = bodyCX + facing * legDX[li];
        legY[li] = bodyCY + bodyHalfH - 2 - legLifts[li];
      }

      for (li = 0; li < 4; li++) {
        ctx.fillStyle = o.outline;
        ctx.fillRect(
          snap(legX[li] - LEG_W / 2) - 1,
          snap(legY[li]) - 1,
          LEG_W + 2,
          LEG_LEN + 2
        );
      }
      for (li = 0; li < 4; li++) {
        ctx.fillStyle = o.legColors[li];
        ctx.fillRect(
          snap(legX[li] - LEG_W / 2),
          snap(legY[li]),
          LEG_W,
          LEG_LEN
        );
      }

      fillEllipse(o.outline, bodyCX, bodyCY, bodyHalfW + 1, bodyHalfH + 1);
      fillEllipse(o.bodyColor, bodyCX, bodyCY, bodyHalfW, bodyHalfH);

      if (o.stretch) {
        ctx.fillStyle = o.legColors[0];
        ctx.fillRect(snap(headCX - 2), snap(bodyCY + bodyHalfH - 2), 9, 4);
      }

      // tail — anchored just outside the body's back edge, opposite the
      // head, and walks steadily further away with each segment so it can't
      // overlap the body silhouette
      const sway = o.tailSway || 0;
      let ti;
      for (ti = 0; ti < 7; ti++) {
        const tx = tailBaseX - facing * ti * 2.3;
        const ty = tailBaseY - Math.sin(ti * 0.5 + sway) * 4 - ti * 0.5;
        const s = Math.max(3, 4 - Math.floor(ti / 4));
        ctx.fillStyle = o.outline;
        ctx.fillRect(snap(tx) - 1, snap(ty) - 1, s + 2, s + 2);
      }
      for (ti = 0; ti < 7; ti++) {
        const tx2 = tailBaseX - facing * ti * 2.3;
        const ty2 = tailBaseY - Math.sin(ti * 0.5 + sway) * 4 - ti * 0.5;
        const s2 = Math.max(3, 4 - Math.floor(ti / 4));
        ctx.fillStyle = o.tailColor;
        ctx.fillRect(snap(tx2), snap(ty2), s2, s2);
      }

      const geom = {
        bodyCX,
        bodyCY,
        bodyHalfW,
        bodyHalfH,
        headCX,
        headCY,
        facing,
      };
      if (o.extraBody) o.extraBody(geom);

      fillEllipse(o.outline, headCX, headCY, HEAD_HALF_W + 1, HEAD_HALF_H + 1);
      fillEllipse(o.headColor, headCX, headCY, HEAD_HALF_W, HEAD_HALF_H);
      if (o.extraHead) o.extraHead(geom);

      drawFace(headCX, headCY, o);
    }

    // fully front-facing skeleton — body, four legs in a row, and a tail
    // that wraps low around one side — for whichever cat is currently
    // stationary at "home"
    function drawResident(o) {
      const bodyHalfW = BODY_HALF_W + (o.stretch ? 3 : 0);
      const bodyHalfH = BODY_HALF_H - (o.stretch ? 1 : 0);
      const bodyCX = o.x;
      const bodyCY = o.groundY - LEG_LEN - bodyHalfH + (o.bob || 0);
      const headCX = bodyCX;
      const headCY = bodyCY - bodyHalfH - HEAD_HALF_H + 3 + (o.headDrop || 0);

      const legDX = [
        -bodyHalfW * 0.55,
        -bodyHalfW * 0.18,
        bodyHalfW * 0.18,
        bodyHalfW * 0.55,
      ];
      let li;
      for (li = 0; li < 4; li++) {
        ctx.fillStyle = o.outline;
        ctx.fillRect(
          snap(bodyCX + legDX[li] - LEG_W / 2) - 1,
          snap(bodyCY + bodyHalfH - 3),
          LEG_W + 2,
          LEG_LEN + 2
        );
      }
      for (li = 0; li < 4; li++) {
        ctx.fillStyle = o.legColor;
        ctx.fillRect(
          snap(bodyCX + legDX[li] - LEG_W / 2),
          snap(bodyCY + bodyHalfH - 2),
          LEG_W,
          LEG_LEN
        );
      }

      fillEllipse(o.outline, bodyCX, bodyCY, bodyHalfW + 1, bodyHalfH + 1);
      fillEllipse(o.bodyColor, bodyCX, bodyCY, bodyHalfW, bodyHalfH);

      if (o.stretch) {
        ctx.fillStyle = o.legColor;
        ctx.fillRect(snap(bodyCX - 3), snap(bodyCY + bodyHalfH - 2), 6, 4);
      }

      const sway = o.tailSway || 0;
      const tailBaseX = bodyCX + bodyHalfW + 2;
      const tailBaseY = bodyCY + bodyHalfH - 4;
      let ti;
      for (ti = 0; ti < 6; ti++) {
        const tx = tailBaseX + ti * 2.2;
        const ty = tailBaseY - Math.sin(ti * 0.5 + sway) * 3 - ti * 0.2;
        const s = Math.max(3, 4 - Math.floor(ti / 3));
        ctx.fillStyle = o.outline;
        ctx.fillRect(snap(tx) - 1, snap(ty) - 1, s + 2, s + 2);
      }
      for (ti = 0; ti < 6; ti++) {
        const tx2 = tailBaseX + ti * 2.2;
        const ty2 = tailBaseY - Math.sin(ti * 0.5 + sway) * 3 - ti * 0.2;
        const s2 = Math.max(3, 4 - Math.floor(ti / 3));
        ctx.fillStyle = o.tailColor;
        ctx.fillRect(snap(tx2), snap(ty2), s2, s2);
      }

      const geom = {
        bodyCX,
        bodyCY,
        bodyHalfW,
        bodyHalfH,
        headCX,
        headCY,
        facing: 1,
      };
      if (o.extraBody) o.extraBody(geom);

      fillEllipse(o.outline, headCX, headCY, HEAD_HALF_W + 1, HEAD_HALF_H + 1);
      fillEllipse(o.headColor, headCX, headCY, HEAD_HALF_W, HEAD_HALF_H);
      if (o.extraHead) o.extraHead(geom);

      drawFace(headCX, headCY, o);
    }

    function gingerMarkings(geom) {
      const pal = FRIEND_PALETTES.ginger;
      ctx.fillStyle = pal.stripe;
      ctx.fillRect(
        snap(geom.bodyCX - geom.facing * 2),
        snap(geom.bodyCY - geom.bodyHalfH + 2),
        7,
        2
      );
      ctx.fillRect(
        snap(geom.bodyCX - geom.facing * 5),
        snap(geom.bodyCY - geom.bodyHalfH + 6),
        6,
        2
      );
    }

    function tuxedoMarkings(geom) {
      const pal = FRIEND_PALETTES.tuxedo;
      fillEllipse(
        pal.white,
        geom.bodyCX - geom.facing * 2,
        geom.bodyCY + 3,
        geom.bodyHalfW - 6,
        geom.bodyHalfH - 3
      );
    }

    function tuxedoChin(geom) {
      const pal = FRIEND_PALETTES.tuxedo;
      ctx.fillStyle = pal.white;
      ctx.fillRect(
        snap(geom.headCX + geom.facing * 2),
        snap(geom.headCY + 6),
        4,
        3
      );
    }

    // flat, direction/pose-agnostic palette for any character — lets either
    // draw function render any cat, so the front-facing "home" pose and the
    // side-profile "in motion" pose can both be used by whichever cat is
    // currently doing which thing
    function getPalette(kind) {
      if (kind === 'sealpoint') {
        return {
          outline: RESIDENT.outline,
          bodyColor: RESIDENT.body,
          headColor: RESIDENT.point,
          earColor: RESIDENT.point,
          tailColor: RESIDENT.point,
          legColor: RESIDENT.point,
          legColors: [
            RESIDENT.point,
            RESIDENT.point,
            RESIDENT.point,
            RESIDENT.point,
          ],
          eyeColor: RESIDENT.eye,
          noseColor: RESIDENT.nose,
          extraBody: null,
          extraHead: null,
        };
      }
      const pal = FRIEND_PALETTES[kind];
      const isTux = kind === 'tuxedo';
      const legColors = isTux
        ? [pal.white, pal.white, pal.white, pal.white]
        : [pal.fur, pal.fur, pal.fur, pal.fur];
      return {
        outline: pal.outline,
        bodyColor: pal.fur,
        headColor: pal.fur,
        earColor: pal.fur,
        tailColor: pal.fur,
        legColor: legColors[0],
        legColors,
        eyeColor: pal.eye,
        noseColor: pal.nose,
        extraBody:
          kind === 'ginger' ? gingerMarkings : isTux ? tuxedoMarkings : null,
        extraHead: isTux ? tuxedoChin : null,
      };
    }

    // ---- gait/motion primitives, shared by whichever cat is performing
    // them — bob is negative-going (moves the body up) to read as a hop
    function boundGait(t) {
      const h = Math.max(0, Math.sin(t / 90)) * 4.5;
      return { legLifts: [h, h, h, h], bob: -h * 1.1 };
    }
    function creepGait(moving) {
      // head held low the whole time it's stalking — trying not to be seen
      return moving
        ? { legLifts: [1.2, 0.3, 1.2, 0.3], bob: 1.5, headDrop: 7 }
        : { legLifts: [0, 0, 0, 0], bob: 1.5, headDrop: 7 };
    }
    function wiggleGait(t) {
      // low, tense, rapid side-to-side rock — the pre-pounce "loading up"
      return {
        legLifts: [1, 1, 1, 1],
        bob: 2.2,
        headDrop: 6,
        jitterX: Math.sin(t / 45) * 2,
      };
    }
    function leapGait(progress) {
      return {
        legLifts: [3, 3, 3, 3],
        bob: -10 * 4 * progress * (1 - progress),
      };
    }
    function swipeGait(t, duration) {
      // one front paw arcs up and across — a swipe, not a step. clawAlpha
      // drives a claw-mark flash drawn on the target's face — that's the
      // part that actually sells "a swipe happened"
      const p = Math.min(1, t / duration);
      const lift = Math.sin(p * Math.PI) * 10;
      let clawAlpha = 0;
      if (p > 0.3 && p < 0.85) {
        clawAlpha = Math.sin(((p - 0.3) / 0.55) * Math.PI);
      }
      return { legLifts: [lift, 0, 0, 0], bob: 0, clawAlpha };
    }
    const CLAW_COLOR = 'oklch(97% 0.01 90)';
    function drawClawMarks(x, y, alpha) {
      if (alpha <= 0) return;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = CLAW_COLOR;
      for (let i = 0; i < 3; i++) {
        const ox = (i - 1) * 5;
        ctx.fillRect(snap(x + ox - 5), snap(y - 6), 3, 3);
        ctx.fillRect(snap(x + ox - 2), snap(y - 2), 3, 3);
        ctx.fillRect(snap(x + ox + 1), snap(y + 2), 3, 3);
      }
      ctx.globalAlpha = 1;
    }
    function biteGait(t, duration) {
      // a quick forward head-snap and back — an attempted love bite
      const p = Math.min(1, t / duration);
      const lunge = Math.sin(p * Math.PI) * 7;
      return { legLifts: [0, 0, 0, 0], bob: 0, headDrop: 3, headLunge: lunge };
    }
    function walkHomeGait(t) {
      const h = Math.max(0, Math.sin(t / 150)) * 2.5;
      const hOpp = Math.max(0, Math.sin(t / 150 + Math.PI)) * 2.5;
      return {
        legLifts: [h, hOpp, h, hOpp],
        bob: -Math.abs(Math.sin(t / 150)) * 1,
      };
    }
    function backAwayGait(t) {
      const h = Math.max(0, Math.sin(t / 260)) * 2;
      const hOpp = Math.max(0, Math.sin(t / 260 + Math.PI)) * 2;
      return {
        legLifts: [h, hOpp, h, hOpp],
        bob: -Math.abs(Math.sin(t / 260)) * 0.8,
      };
    }
    function flinchGait(t) {
      const h = Math.abs(Math.sin(t / 55)) * 3;
      return { legLifts: [h, h, h, h], bob: -h * 1.2 };
    }
    function dashGait(t) {
      const h = Math.max(0, Math.sin(t / 75)) * 3.2;
      const hOpp = Math.max(0, Math.sin(t / 75 + Math.PI)) * 3.2;
      return {
        legLifts: [h, hOpp, h, hOpp],
        bob: -Math.abs(Math.sin(t / 75)) * 1.6,
      };
    }

    const PERSONALITIES = {
      ginger: { approach: 'bound', react: 'backAway' },
      tuxedo: { approach: 'creep', react: 'frightFlee' },
    };
    const SPEED = {
      bound: 85,
      leapDuration: 260,
      settle: 45,
      backAway: 20,
      flinchDuration: 220,
      dash: 110,
    };
    // the tuxedo's stalking rhythm: creep, pause, creep, pause, creep,
    // pause, wiggle (loading up), then leap the last stretch. moveSpeed is
    // fixed and genuinely slow so "creep" always reads as slower than "bound"
    const CREEP = {
      moveSpeed: 24,
      pauseDuration: 420,
      cycles: 3,
      wiggleDuration: 480,
      leapTriggerDist: 45,
    };
    // arrival flourishes: the ginger swipes after its bound, the tuxedo
    // bites after its leap, and the seal point swipes back at the ginger
    const GESTURE = {
      swipeDuration: 380,
      biteDuration: 340,
      swipeBackDuration: 380,
    };

    // ---- the encounter director: a two-round, role-swapping choreography.
    // Round 1: friend approaches and intrudes on the seal point's space; the
    // seal point reacts and exits; the friend settles into the vacated home
    // spot. Round 2 replays the same approach/react pair with the two cats
    // swapped — then resets.
    const enc = {
      phase: 'idle', // idle | approach | react | settle | pause
      round: 0,
      personality: null,
      style: null,
      moverKind: null,
      reactorKind: null,
      homeKind: 'sealpoint',
      moverX: 0,
      moverPhaseT: 0,
      moverSub: null,
      leapStartX: 0,
      creepStep: 0,
      creepSpeed: 0,
      creepMoveDuration: 0,
      reactorX: 0,
      reactorPhaseT: 0,
      reactorSub: null,
      reactorAlpha: 1,
      homeX: 0,
      intrudeX: 0,
      exitX: 0,
      offscreenX: -45,
      pauseUntil: 0,
      nextEncounterAt: 2000 + Math.random() * 2200,
    };

    function startCreep() {
      enc.moverSub = 'creepMove';
      enc.creepStep = 0;
      enc.creepSpeed = CREEP.moveSpeed;
      const totalDist = enc.intrudeX - CREEP.leapTriggerDist - enc.moverX;
      enc.creepMoveDuration = Math.max(
        250,
        (totalDist / CREEP.cycles / CREEP.moveSpeed) * 1000
      );
    }

    const IDLE_MOVES = ['blink', 'blink', 'blink', 'earTwitch', 'stretch'];
    const PET_REACTIONS = ['heart', 'heart', 'purr', 'happy'];

    const state = {
      t: 0,
      breathPhase: 0,
      tailPhase: 0,
      idleMove: null,
      idleMoveUntil: 0,
      nextIdleAt: 2200 + Math.random() * 2000,
      nextZAt: 1800 + Math.random() * 2000,
      nextDelightAt: 2600 + Math.random() * 2200,
      petUntil: 0,
      particles: [],
    };

    // approximate head position of whoever currently has the fish — used to
    // spawn the delight heart in the right spot
    function fishHolderHeadPos() {
      const held =
        (enc.phase === 'approach' &&
          (enc.moverSub === 'swipe' || enc.moverSub === 'bite')) ||
        enc.phase === 'react' ||
        enc.phase === 'settle';
      return held ? sideHeadPos(enc.moverX, 1) : frontHeadPos(enc.homeX);
    }

    function spawnParticle(type, atX, atY) {
      const fromHead = type === 'z' || type === 'note';
      const x = atX !== undefined ? atX : fromHead ? residentHeadX : cx;
      const y =
        atY !== undefined
          ? atY
          : fromHead
            ? residentHeadY - 8
            : baseY - BODY_HALF_H - LEG_LEN - 6;
      state.particles.push({
        type,
        x,
        y,
        vx: fromHead ? 0.006 : (Math.random() - 0.5) * 0.01,
        vy: -0.012,
        born: state.t,
        life: type === 'z' ? 2200 : type === 'note' ? 1500 : 1400,
        size: type === 'z' ? 8 + Math.random() * 3 : 0,
      });
      if (state.particles.length > 6) state.particles.shift();
    }

    function pet() {
      if (
        enc.phase !== 'idle' &&
        enc.phase !== 'approach' &&
        enc.phase !== 'pause'
      )
        return;
      state.petUntil = state.t + 1300;
      state.idleMoveUntil = 0;
      const reaction =
        PET_REACTIONS[Math.floor(Math.random() * PET_REACTIONS.length)];
      if (reaction === 'heart') spawnParticle('heart');
      else if (reaction === 'purr') spawnParticle('note');
      // 'happy': tail sway + open eyes only, already driven by the petting flag
    }

    // periodic head-dip: quick peck down and back up, then a rest — reads
    // as taking bites, not just breathing
    function nibbleDrop(t, period, amount) {
      const frac = (t % period) / period;
      return frac < 0.3 ? Math.sin((frac / 0.3) * Math.PI) * amount : 0;
    }

    function draw() {
      ctx.clearRect(0, 0, cssW, cssH);

      const homeIsSealpoint = enc.homeKind === 'sealpoint';
      const showHome =
        enc.phase === 'idle' ||
        enc.phase === 'approach' ||
        enc.phase === 'pause';
      const petting = state.t < state.petUntil;
      const idleActive = !petting && state.t < state.idleMoveUntil;
      const move = idleActive ? state.idleMove : null;

      // once the intruder reaches the fight (its swipe/bite, and every beat
      // after until it's settled at home), it's the one carrying the fish
      const fishHeld =
        (enc.phase === 'approach' &&
          (enc.moverSub === 'swipe' || enc.moverSub === 'bite')) ||
        enc.phase === 'react' ||
        enc.phase === 'settle';

      if (showHome) {
        // whoever holds the corner holds the fish — that's the whole plot
        if (!fishHeld) drawFish(enc.homeX - 22, baseY - 5);
        if (homeIsSealpoint) {
          drawResident({
            x: enc.homeX,
            groundY: baseY,
            bob: Math.sin(state.breathPhase / 1400) * 0.6,
            headDrop: nibbleDrop(state.breathPhase, 2400, 5),
            stretch: move === 'stretch',
            eyesOpen: petting || move === 'blink' || move === 'stretch',
            earTwitch: move === 'earTwitch',
            tailSway:
              Math.sin(state.tailPhase / (petting ? 500 : 1600)) *
              (petting ? 0.5 : 0.22),
            ...getPalette('sealpoint'),
          });
        } else {
          drawResident({
            x: enc.homeX,
            groundY: baseY,
            bob: Math.sin(state.breathPhase / 950) * 0.7,
            headDrop: nibbleDrop(state.breathPhase, 3200, 3),
            eyesOpen: true,
            tailSway: Math.sin(state.tailPhase / 900) * 0.28,
            ...getPalette(enc.homeKind),
          });
        }
      }

      if (enc.phase === 'approach' || enc.phase === 'settle') {
        let g;
        if (enc.phase === 'approach') {
          if (enc.style.approach === 'bound') {
            g =
              enc.moverSub === 'swipe'
                ? swipeGait(enc.moverPhaseT, GESTURE.swipeDuration)
                : boundGait(enc.moverPhaseT);
          } else if (enc.moverSub === 'creepMove') g = creepGait(true);
          else if (enc.moverSub === 'creepPause') g = creepGait(false);
          else if (enc.moverSub === 'wiggle') g = wiggleGait(enc.moverPhaseT);
          else if (enc.moverSub === 'bite')
            g = biteGait(enc.moverPhaseT, GESTURE.biteDuration);
          else g = leapGait(Math.min(1, enc.moverPhaseT / SPEED.leapDuration));
        } else {
          g = walkHomeGait(enc.moverPhaseT);
        }
        drawCat({
          x: enc.moverX + (g.jitterX || 0),
          groundY: baseY,
          facing: 1,
          bob: g.bob,
          legLifts: g.legLifts,
          headDrop: g.headDrop,
          headLunge: g.headLunge,
          eyesOpen: true,
          tailSway: Math.sin(enc.moverPhaseT / 260) * 0.3,
          ...getPalette(enc.moverKind),
        });

        // the ginger's swipe lands on whoever's still lounging at home
        if (g.clawAlpha) {
          const swipeTarget = frontHeadPos(enc.homeX);
          drawClawMarks(swipeTarget.x, swipeTarget.y, g.clawAlpha);
        }

        // won it — carrying the fish home in its mouth
        if (fishHeld) {
          const moverMouth = sideHeadPos(enc.moverX + (g.jitterX || 0), 1);
          drawFish(moverMouth.x + 12, moverMouth.y + 8);
        }
      }

      if (enc.phase === 'react') {
        drawCat({
          x: enc.moverX,
          groundY: baseY,
          facing: 1,
          bob: 0,
          legLifts: [0, 0, 0, 0],
          eyesOpen: true,
          tailSway: 0.2,
          ...getPalette(enc.moverKind),
        });

        const reactMouth = sideHeadPos(enc.moverX, 1);
        drawFish(reactMouth.x + 12, reactMouth.y + 8);

        const isBackAway = enc.style.react === 'backAway';
        const rg =
          enc.reactorSub === 'swipeBack'
            ? swipeGait(enc.reactorPhaseT, GESTURE.swipeBackDuration)
            : isBackAway
              ? backAwayGait(enc.reactorPhaseT)
              : enc.reactorSub === 'flinch'
                ? flinchGait(enc.reactorPhaseT)
                : dashGait(enc.reactorPhaseT);

        ctx.globalAlpha = enc.reactorAlpha;
        drawCat({
          // backing away: body still moves toward the exit, but faces
          // backward (toward the intruder) — a true walk-backward retreat,
          // with a sneer instead of a normal face
          x: enc.reactorX,
          groundY: baseY,
          facing: isBackAway ? -1 : 1,
          bob: rg.bob,
          legLifts: rg.legLifts,
          eyesOpen: true,
          expression: isBackAway ? 'sneer' : null,
          tailSway: 0,
          ...getPalette(enc.reactorKind),
        });
        ctx.globalAlpha = 1;

        // the seal point's counter-swipe lands on the ginger, still
        // holding its ground at intrudeX
        if (rg.clawAlpha) {
          const backSwipeTarget = sideHeadPos(enc.moverX, 1);
          drawClawMarks(backSwipeTarget.x, backSwipeTarget.y, rg.clawAlpha);
        }
      }

      // particles render regardless of who's home now — the delight heart
      // (and a pet-heart on a lounging friend) need to show up too
      if (state.particles.length) {
        ctx.textBaseline = 'alphabetic';
        state.particles.forEach((p) => {
          const age = state.t - p.born;
          const life = age / p.life;
          if (life > 1) return;
          ctx.globalAlpha = Math.max(0, 1 - life);
          const px = p.x + p.vx * age;
          const py = p.y + p.vy * age;
          if (p.type === 'z') {
            ctx.fillStyle = RESIDENT.outline;
            ctx.font = `${p.size || 9}px 'Sometype Mono', monospace`;
            ctx.fillText('z', px, py);
          } else if (p.type === 'note') {
            ctx.fillStyle = RESIDENT.eye;
            ctx.font = "10px 'Sometype Mono', monospace";
            ctx.fillText('♪', px, py);
          } else {
            ctx.fillStyle = HEART;
            ctx.fillRect(snap(px - 2), snap(py), 2, 2);
            ctx.fillRect(snap(px + 1), snap(py), 2, 2);
            ctx.fillRect(snap(px - 1), snap(py + 2), 3, 2);
          }
        });
        ctx.globalAlpha = 1;
      }
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      cssW = Math.max(1, Math.round(rect.width));
      cssH = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      cx = snap(cssW * 0.74);
      baseY = snap(cssH - 4);
      const bodyCY = baseY - LEG_LEN - BODY_HALF_H;
      residentHeadX = cx;
      residentHeadY = bodyCY - BODY_HALF_H - HEAD_HALF_H + 3;
      enc.homeX = cx;
      enc.intrudeX = snap(cx - 40);
      enc.exitX = snap(cssW + 30);
      enc.offscreenX = -45;
      draw();
    }

    function updateEncounter(dt) {
      if (enc.phase === 'idle') {
        if (state.t >= enc.nextEncounterAt) {
          // the very first visitor is a coin flip; every encounter after
          // that strictly alternates (so it reads as taking turns, not luck)
          enc.personality =
            enc.personality === null
              ? Math.random() < 0.5
                ? 'ginger'
                : 'tuxedo'
              : enc.personality === 'ginger'
                ? 'tuxedo'
                : 'ginger';
          enc.style = PERSONALITIES[enc.personality];
          enc.round = 1;
          enc.moverKind = enc.personality;
          enc.moverX = enc.offscreenX;
          enc.moverPhaseT = 0;
          if (enc.style.approach === 'creep') startCreep();
          else enc.moverSub = null;
          enc.phase = 'approach';
        }
        return;
      }

      if (enc.phase === 'approach') {
        enc.moverPhaseT += dt;
        let arrived = false;
        if (enc.style.approach === 'bound') {
          if (enc.moverSub === null) {
            enc.moverX += (SPEED.bound * dt) / 1000;
            if (enc.moverX >= enc.intrudeX) {
              enc.moverX = enc.intrudeX;
              enc.moverSub = 'swipe';
              enc.moverPhaseT = 0;
            }
          } else if (enc.moverSub === 'swipe') {
            arrived = enc.moverPhaseT >= GESTURE.swipeDuration;
          }
        } else if (enc.moverSub === 'creepMove') {
          enc.moverX += (enc.creepSpeed * dt) / 1000;
          if (enc.moverPhaseT >= enc.creepMoveDuration) {
            enc.creepStep++;
            enc.moverPhaseT = 0;
            enc.moverSub =
              enc.creepStep >= CREEP.cycles ? 'wiggle' : 'creepPause';
          }
        } else if (enc.moverSub === 'creepPause') {
          if (enc.moverPhaseT >= CREEP.pauseDuration) {
            enc.moverPhaseT = 0;
            enc.moverSub = 'creepMove';
          }
        } else if (enc.moverSub === 'wiggle') {
          if (enc.moverPhaseT >= CREEP.wiggleDuration) {
            enc.moverSub = 'leap';
            enc.leapStartX = enc.moverX;
            enc.moverPhaseT = 0;
          }
        } else if (enc.moverSub === 'leap') {
          const p = Math.min(1, enc.moverPhaseT / SPEED.leapDuration);
          enc.moverX = enc.leapStartX + (enc.intrudeX - enc.leapStartX) * p;
          if (p >= 1) {
            enc.moverX = enc.intrudeX;
            enc.moverSub = 'bite';
            enc.moverPhaseT = 0;
          }
        } else if (enc.moverSub === 'bite') {
          arrived = enc.moverPhaseT >= GESTURE.biteDuration;
        }
        if (arrived) {
          enc.reactorKind = enc.homeKind;
          enc.reactorX = enc.homeX;
          enc.reactorPhaseT = 0;
          enc.reactorAlpha = 1;
          enc.reactorSub =
            enc.style.react === 'frightFlee'
              ? 'flinch'
              : enc.style.react === 'backAway'
                ? 'swipeBack'
                : null;
          enc.phase = 'react';
        }
        return;
      }

      if (enc.phase === 'react') {
        enc.reactorPhaseT += dt;
        if (enc.style.react === 'backAway') {
          if (enc.reactorSub === 'swipeBack') {
            if (enc.reactorPhaseT >= GESTURE.swipeBackDuration) {
              enc.reactorSub = null;
              enc.reactorPhaseT = 0;
            }
          } else {
            enc.reactorX += (SPEED.backAway * dt) / 1000;
          }
        } else if (enc.reactorSub === 'flinch') {
          if (enc.reactorPhaseT >= SPEED.flinchDuration) {
            enc.reactorSub = 'dash';
            enc.reactorPhaseT = 0;
          }
        } else {
          enc.reactorX += (SPEED.dash * dt) / 1000;
        }
        const distToExit = enc.exitX - enc.reactorX;
        enc.reactorAlpha = distToExit < 18 ? Math.max(0, distToExit / 18) : 1;
        if (enc.reactorX >= enc.exitX) {
          enc.moverPhaseT = 0;
          enc.phase = 'settle';
        }
        return;
      }

      if (enc.phase === 'settle') {
        enc.moverPhaseT += dt;
        enc.moverX += (SPEED.settle * dt) / 1000;
        if (enc.moverX >= enc.homeX) {
          enc.moverX = enc.homeX;
          enc.homeKind = enc.moverKind;
          enc.phase = 'pause';
          // longer beat before the seal point's mimicry re-entry (round 1)
          // than before the final reset (round 2) — gives the "friend
          // lounging at home" moment room to actually land
          enc.pauseUntil =
            state.t +
            (enc.round === 1
              ? 3200 + Math.random() * 1600
              : 1400 + Math.random() * 900);
        }
        return;
      }

      if (enc.phase === 'pause') {
        if (state.t >= enc.pauseUntil) {
          if (enc.round === 1) {
            enc.round = 2;
            enc.moverKind = 'sealpoint';
            enc.moverX = enc.offscreenX;
            enc.moverPhaseT = 0;
            if (enc.style.approach === 'creep') startCreep();
            else enc.moverSub = null;
            enc.phase = 'approach';
          } else {
            enc.phase = 'idle';
            enc.nextEncounterAt = state.t + 7000 + Math.random() * 8000;
          }
        }
      }
    }

    const onKeydown = (e) => {
      const tag = document.activeElement && document.activeElement.tagName;
      if (e.code === 'Space' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        pet();
      }
    };

    canvas.addEventListener('click', pet);
    window.addEventListener('keydown', onKeydown);
    window.addEventListener('resize', resize);

    resize();

    let rafId = null;
    let last = null;
    function frame(ts) {
      if (last === null) last = ts;
      const dt = Math.min(48, ts - last);
      last = ts;
      state.t += dt;
      state.breathPhase += dt;
      state.tailPhase += dt;

      if (
        enc.homeKind === 'sealpoint' &&
        (enc.phase === 'idle' || enc.phase === 'pause')
      ) {
        if (state.t >= state.nextIdleAt && state.t >= state.petUntil) {
          state.idleMove =
            IDLE_MOVES[Math.floor(Math.random() * IDLE_MOVES.length)];
          const dur =
            state.idleMove === 'stretch'
              ? 750
              : state.idleMove === 'earTwitch'
                ? 320
                : 550;
          state.idleMoveUntil = state.t + dur;
          state.nextIdleAt = state.idleMoveUntil + 2600 + Math.random() * 3600;
        }
        if (state.t >= state.nextZAt) {
          spawnParticle('z');
          state.nextZAt = state.t + 5000 + Math.random() * 4000;
        }
      }

      // delight heart — drifts up from whoever currently has the fish,
      // regardless of which cat that is or what phase the encounter is in
      if (state.t >= state.nextDelightAt) {
        const holderPos = fishHolderHeadPos();
        spawnParticle('heart', holderPos.x + 12, holderPos.y - 6);
        state.nextDelightAt = state.t + 2600 + Math.random() * 2200;
      }

      state.particles = state.particles.filter(
        (p) => state.t - p.born < p.life
      );

      updateEncounter(dt);

      draw();
      rafId = requestAnimationFrame(frame);
    }
    if (!reduceMotion) rafId = requestAnimationFrame(frame);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      canvas.removeEventListener('click', pet);
      window.removeEventListener('keydown', onKeydown);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="cat-canvas"
      width="620"
      height="172"
      aria-hidden="true"
    />
  );
};

export default Cat;
