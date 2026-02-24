import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js'

// Šiuos duomenis rasi Supabase -> Settings -> API
const supabaseUrl = 'https://hzktkqocwjcvewnbkgxo.supabase.co'
const supabaseKey = 'sb_publishable_bwT8FbETDWdJXWtRbv7D_A_3nvpZ31A'
const supabase = createClient(supabaseUrl, supabaseKey)

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&family=Plus+Jakarta+Sans:wght@300;400;600&display=swap&subset=latin-ext');;

html, body, #root {
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  display: block !important;
}

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{--cream:#fdf8f2;--warm:#f6ede0;--brown:#2e1a0f;--mid:#7a4f35;--accent:#d9603a;--peach:#f7c9a8;--gray:#a08878;--border:rgba(122,79,53,.13);--green:#2a9d5c;--gl:#e3f5ec}
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--cream);color:var(--brown);overflow-x:hidden}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes scanline{0%{top:-10%}100%{top:110%}}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.8)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes overlayIn{from{opacity:0}to{opacity:1}}
@keyframes modalIn{from{opacity:0;transform:translateY(30px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes adminIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
.fu{animation:fadeUp .6s both}.fu1{animation:fadeUp .6s .1s both}.fu2{animation:fadeUp .6s .22s both}.fu3{animation:fadeUp .6s .36s both}.fu4{animation:fadeUp .6s .5s both}
.nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:.9rem 6%;display:flex;align-items:center;justify-content:space-between;background:rgba(253,248,242,.96);backdrop-filter:blur(14px);border-bottom:1px solid var(--border)}
.nav-logo{font-family:'Fraunces',serif;font-weight:900;font-size:1.35rem;color:var(--brown);letter-spacing:-.02em}
.nav-logo em{font-style:normal;color:var(--accent)}
.nav-right{display:flex;gap:.7rem;align-items:center}
.nav-cta{background:var(--accent);color:#fff;font-family:inherit;font-size:.85rem;font-weight:600;padding:.55rem 1.4rem;border-radius:8px;border:none;cursor:pointer}
.nav-cta:hover{background:#bf4f2b}
.hero{min-height:100vh;padding:8rem 5% 5rem;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
.blob{position:absolute;border-radius:50%;filter:blur(90px);opacity:.4;pointer-events:none}
.b1{width:540px;height:540px;background:var(--peach);top:-110px;right:-110px}
.b2{width:380px;height:380px;background:#f4d0b8;bottom:-70px;left:-90px}
.b3{width:280px;height:280px;background:#fce8d0;top:45%;left:32%;opacity:.2}
.page-col{width:100%;max-width:1060px;margin:0 auto;position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;text-align:center}
.hero-eyebrow{font-size:.72rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem;display:flex;align-items:center;gap:.5rem;justify-content:center}
.hero-eyebrow::before,.hero-eyebrow::after{content:'';width:24px;height:1px;background:var(--accent);opacity:.5}
.hero-h1{font-family:'Fraunces',serif;font-size:clamp(2.3rem,5vw,4.4rem);font-weight:900;line-height:1.07;letter-spacing:-.03em;max-width:780px;margin-bottom:1.3rem}
.hero-h1 em{font-style:italic;color:var(--accent)}
.hero-sub{font-size:1.05rem;line-height:1.8;color:var(--mid);font-weight:300;max-width:520px;margin-bottom:1.2rem}
.hero-sub strong{color:var(--brown);font-weight:600}
.hero-chips{display:flex;flex-wrap:wrap;gap:.45rem;justify-content:center;margin-bottom:2.8rem}
.chip{background:#fff;border:1px solid var(--border);border-radius:20px;padding:.28rem .75rem;font-size:.78rem;color:var(--mid);font-weight:500}
.hero-pills{display:flex;gap:2.5rem;justify-content:center;margin-bottom:3rem}
.pill-val{font-family:'Fraunces',serif;font-size:1.75rem;font-weight:900;color:var(--accent);line-height:1;margin-bottom:.15rem}
.pill-lbl{font-size:.73rem;color:var(--gray);font-weight:500}
.hero-row{display:grid;grid-template-columns:215px 1fr 215px;gap:2rem;align-items:center;width:100%;max-width:1060px;margin:0 auto;text-align:left;justify-content:center}
.form-box{background:#fff;border-radius:18px;padding:2.2rem 2rem 1.8rem;box-shadow:0 12px 50px rgba(46,26,15,.1);border:1px solid var(--border);margin:0 auto;width:100%;max-width:440px}
.hf-title{font-family:'Fraunces',serif;font-size:1.25rem;font-weight:700;margin-bottom:.25rem}
.hf-desc{font-size:.83rem;color:var(--gray);margin-bottom:1.5rem;line-height:1.55}
.fg{display:flex;flex-direction:column;gap:.35rem;margin-bottom:.9rem}
.fg label{font-size:.79rem;font-weight:600;color:var(--mid)}
.req{color:var(--accent)}
.fg input{padding:.82rem 1rem;border:1.5px solid var(--border);border-radius:9px;font-family:inherit;font-size:.93rem;background:var(--cream);color:var(--brown);outline:none;width:100%;transition:border-color .2s}
.fg input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(217,96,58,.1);background:#fff}
.fg input::placeholder{color:var(--gray);opacity:.6}
.hf-note{font-size:.72rem;color:var(--gray);text-align:center;margin-top:.8rem}
.btn{display:block;width:100%;background:var(--accent);color:#fff;font-family:inherit;font-size:1rem;font-weight:600;padding:.92rem;border-radius:9px;border:none;cursor:pointer;margin-top:.2rem}
.btn:hover{background:#bf4f2b;transform:translateY(-2px)}
.btn:disabled{opacity:.6;cursor:not-allowed;transform:none}
.phone{background:var(--brown);border-radius:34px;padding:1.4rem 1.05rem 1.9rem;box-shadow:0 28px 70px rgba(46,26,15,.26);width:215px;flex-shrink:0;margin:0 auto}
.phone-notch{width:58px;height:5px;border-radius:3px;background:rgba(255,255,255,.12);margin:0 auto 1.1rem}
.phone-screen{background:var(--cream);border-radius:22px;padding:.9rem;display:flex;flex-direction:column;gap:.5rem}
.ps-head{font-family:'Fraunces',serif;font-size:.75rem;font-weight:700;color:var(--brown)}
.cam-vf{border-radius:14px;overflow:hidden;position:relative;height:112px;background:linear-gradient(150deg,#1c1209,#2e1c0d);display:flex;align-items:center;justify-content:center}
.cam-food{font-size:3rem;z-index:1;position:relative;animation:float 3s ease-in-out infinite}
.cam-scan{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(217,96,58,.95),transparent);animation:scanline 2.2s ease-in-out infinite;z-index:2}
.cam-c{position:absolute;width:14px;height:14px;border-color:rgba(217,96,58,.9);border-style:solid;z-index:3}
.cam-c.tl{top:7px;left:7px;border-width:2px 0 0 2px;border-radius:3px 0 0 0}
.cam-c.tr{top:7px;right:7px;border-width:2px 2px 0 0;border-radius:0 3px 0 0}
.cam-c.bl{bottom:7px;left:7px;border-width:0 0 2px 2px;border-radius:0 0 0 3px}
.cam-c.br{bottom:7px;right:7px;border-width:0 2px 2px 0;border-radius:0 0 3px 0}
.cam-dot{position:absolute;top:8px;left:50%;transform:translateX(-50%);width:5px;height:5px;background:rgba(217,96,58,.9);border-radius:50%;animation:pulse 1.6s infinite;z-index:3}
.hc{background:#fff;border-radius:12px;padding:.62rem .68rem;border:1px solid rgba(42,157,92,.2)}
.hc-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:.32rem}
.hc-lbl{font-size:.5rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--gray)}
.hc-score{font-family:'Fraunces',serif;font-size:1.3rem;font-weight:900;color:var(--green);line-height:1}
.hc-max{font-size:.5rem;color:var(--gray)}
.hc-food{font-size:.68rem;font-weight:700;color:var(--brown);margin-bottom:.34rem}
.hb-row{display:flex;flex-direction:column;gap:.23rem}
.hb{display:flex;align-items:center;gap:.32rem}
.hb-l{font-size:.45rem;color:var(--gray);width:44px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.hb-t{flex:1;height:4px;background:rgba(122,79,53,.1);border-radius:3px;overflow:hidden}
.hb-f{height:100%;border-radius:3px}
.hb-f.k{background:var(--accent)}.hb-f.p{background:var(--green)}.hb-f.f{background:#e09040}.hb-f.c{background:#5b9bd5}
.hb-v{font-size:.5rem;font-weight:700;color:var(--brown);width:22px;text-align:right}
.hc-badge.good{background:var(--gl);color:var(--green)}
.hc-badge.warn{background:#fff8e1;color:#b7791f}
.ub{background:#fff;border-radius:9px 9px 9px 2px;padding:.42rem .58rem;font-size:.62rem;color:var(--mid);line-height:1.46;max-width:90%}
.ab{background:linear-gradient(135deg,var(--accent),#c04f28);border-radius:2px 9px 9px 9px;padding:.5rem .64rem;color:#fff;max-width:94%;align-self:flex-end}
.ab-lbl{font-size:.48rem;letter-spacing:.07em;text-transform:uppercase;opacity:.75;margin-bottom:.12rem}
.ab-txt{font-size:.62rem;line-height:1.5}
.sec{padding:6rem 5%;display:flex;justify-content:center}
.sec.warm{background:var(--warm)}.sec.white{background:#fff}
.sec-inner{max-width:1020px;width:100%;display:grid;grid-template-columns:1fr 1fr;gap:4.5rem;align-items:center;margin:0 auto}
.sec-inner.rev{direction:rtl}.sec-inner.rev>*{direction:ltr}
.sec-tag{font-size:.72rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:.7rem}
.sec-title{font-family:'Fraunces',serif;font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:900;line-height:1.12;letter-spacing:-.02em;margin-bottom:1rem}
.sec-title em{font-style:italic;color:var(--accent)}
.sec-body{font-size:1rem;line-height:1.85;color:var(--mid);font-weight:300;margin-bottom:1.5rem}
.sec-body strong{color:var(--brown);font-weight:600}
.steps{display:flex;flex-direction:column;gap:.7rem}
.step{display:flex;align-items:flex-start;gap:.8rem}
.step-n{width:26px;height:26px;border-radius:50%;background:var(--accent);color:#fff;font-size:.72rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:.05rem}
.step-t{font-size:.9rem;color:var(--mid);line-height:1.55}
.step-t strong{color:var(--brown);font-weight:600}
.foto-wrap{display:flex;justify-content:center;position:relative}
.foto-float{animation:float 4s ease-in-out infinite;position:relative;display:inline-block}
.badge{position:absolute;background:#fff;border-radius:12px;padding:.55rem .9rem;box-shadow:0 8px 28px rgba(46,26,15,.14);border:1px solid var(--border);white-space:nowrap;z-index:10}
.badge.tl{top:-18px;left:-55px}.badge.br{bottom:28px;right:-55px}
.bdg-l{font-size:.58rem;color:var(--gray);font-weight:500;margin-bottom:.08rem}
.bdg-v{font-family:'Fraunces',serif;font-size:.95rem;font-weight:900;color:var(--brown)}
.bdg-v em{font-style:normal;color:var(--accent)}
.chat-mockup{background:#fff;border-radius:24px;box-shadow:0 20px 60px rgba(46,26,15,.12);border:1px solid var(--border);overflow:hidden;max-width:400px;width:100%;margin:0 auto}
.chat-header{background:var(--brown);padding:1rem 1.2rem;display:flex;align-items:center;gap:.7rem}
.chat-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--accent),#c04f28);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}
.chat-hname{font-family:'Fraunces',serif;font-weight:700;font-size:.9rem;color:#fff}
.chat-body{padding:1.2rem 1rem;display:flex;flex-direction:column;gap:.65rem;background:var(--cream)}
.chat-msg{display:flex;flex-direction:column;gap:.2rem}
.chat-msg.user{align-items:flex-end}.chat-msg.ai{align-items:flex-start}
.chat-bubble{padding:.65rem .9rem;border-radius:16px;font-size:.88rem;line-height:1.55;max-width:85%}
.chat-msg.user .chat-bubble{background:var(--accent);color:#fff;border-radius:16px 16px 4px 16px}
.chat-msg.ai .chat-bubble{background:#fff;color:var(--brown);border-radius:16px 16px 16px 4px;border:1px solid var(--border)}
.chat-who{font-size:.65rem;color:var(--gray);font-weight:500;padding:0 .3rem}
.chat-footer{padding:.8rem 1rem;border-top:1px solid var(--border);background:#fff;display:flex;align-items:center;gap:.6rem}
.chat-input-box{flex:1;background:var(--cream);border-radius:20px;padding:.5rem .9rem;font-size:.82rem;color:var(--gray);border:1px solid var(--border)}
.ai-examples{display:flex;flex-direction:column;gap:.6rem;margin-top:1.5rem}
.ai-ex{background:var(--warm);border-radius:10px;padding:.7rem 1rem;font-size:.88rem;color:var(--mid);border-left:3px solid var(--peach);line-height:1.5}
.ai-ex strong{color:var(--accent);font-weight:600}
.prog-sec{padding:6rem 5%;background:var(--warm);display:flex;justify-content:center}
.prog-sec-inner{max-width:1020px;width:100%;display:grid;grid-template-columns:1fr 1fr;gap:4.5rem;align-items:center;margin:0 auto}
.prog-phone-wrap{display:flex;justify-content:center}
.prog-phone{background:#2e1a0f;border-radius:36px;padding:1.5rem 1.1rem 2rem;box-shadow:0 32px 80px rgba(46,26,15,.3);width:240px;margin:0 auto}
.prog-phone-notch{width:60px;height:5px;border-radius:3px;background:rgba(255,255,255,.12);margin:0 auto 1.2rem}
.prog-phone-screen{background:var(--cream);border-radius:24px;padding:1rem;display:flex;flex-direction:column;gap:.6rem}
.prog-screen-head{display:flex;justify-content:space-between;align-items:center}
.prog-screen-title{font-family:'Fraunces',serif;font-size:.82rem;font-weight:700;color:var(--brown)}
.prog-screen-sub{font-size:.6rem;color:var(--gray)}
.prog-ring-wrap{display:flex;flex-direction:column;align-items:center;gap:.3rem;padding:.2rem 0}
.prog-ring-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center}
.prog-ring-num{font-family:'Fraunces',serif;font-size:1.1rem;font-weight:900;color:var(--brown);line-height:1;white-space:nowrap}
.prog-ring-unit{font-size:.48rem;color:var(--gray);margin-top:1px}
.prog-macros{display:flex;gap:.5rem;width:100%}
.prog-mac{flex:1;background:#fff;border-radius:10px;padding:.55rem .4rem;text-align:center;min-width:0}
.prog-mac-val{font-family:'Fraunces',serif;font-size:1rem;font-weight:900;color:var(--accent);line-height:1;margin-bottom:.15rem}
.prog-mac-lbl{font-size:.52rem;color:var(--gray);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.prog-tip{background:var(--accent);border-radius:10px;padding:.65rem .75rem}
.prog-tip-lbl{font-size:.48rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:rgba(255,255,255,.7);margin-bottom:.2rem}
.prog-tip-txt{font-size:.65rem;color:#fff;line-height:1.5}
.feat-section{padding:5.5rem 5%;display:flex;justify-content:center}
.feat-col{width:100%;max-width:720px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:2.5rem;margin:0 auto}
.feat-list{list-style:none;display:inline-flex;flex-direction:column;gap:.4rem;text-align:left}
.feat-list li{display:flex;align-items:flex-start;gap:.5rem;font-size:.9rem;color:var(--mid)}
.feat-list li::before{content:'✓';color:var(--accent);font-weight:700;flex-shrink:0}
.pc-wrap{width:100%;max-width:440px;margin:0 auto}
.pc{background:var(--brown);border-radius:14px;padding:.8rem;width:100%}
.pc-screen{background:var(--cream);border-radius:8px;padding:1.1rem}
.pc-dots{display:flex;gap:4px;margin-bottom:.9rem}
.pc-dot{width:8px;height:8px;border-radius:50%;background:rgba(122,79,53,.18)}
.pc-t{font-family:'Fraunces',serif;font-size:.82rem;font-weight:700;color:var(--brown);margin-bottom:.7rem}
.pc-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-bottom:.8rem}
.pc-stat{background:#fff;border-radius:8px;padding:.6rem;text-align:center}
.pc-sn{font-family:'Fraunces',serif;font-size:1rem;font-weight:900;color:var(--accent)}
.pc-sl{font-size:.55rem;color:var(--gray);margin-top:1px}
.pc-bars{display:flex;flex-direction:column;gap:.45rem}
.pc-bar{display:flex;flex-direction:column;gap:.15rem}
.pc-bl{display:flex;justify-content:space-between;font-size:.6rem;color:var(--gray)}
.pc-bt{height:5px;background:rgba(122,79,53,.1);border-radius:3px;overflow:hidden}
.pc-bf{height:100%;border-radius:3px;background:var(--accent)}
.pc-stand{width:50px;height:7px;background:var(--brown);margin:.4rem auto 0;border-radius:0 0 3px 3px}
.pc-base{width:90px;height:3px;background:rgba(46,26,15,.25);margin:0 auto;border-radius:2px}
.grid-sec{background:var(--brown);color:#fff;padding:5.5rem 5%}
.grid-inner{max-width:960px;margin:0 auto}
.gs-head{text-align:center;margin-bottom:3rem}
.gs-tag{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--peach);font-weight:600;margin-bottom:.6rem}
.gs-title{font-family:'Fraunces',serif;font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:900;letter-spacing:-.02em;line-height:1.1}
.gs-sub{font-size:.93rem;opacity:.5;margin-top:.6rem;font-weight:300}
.gs-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.07);border-radius:14px;overflow:hidden}
.gs-card{background:rgba(255,255,255,.04);padding:1.7rem 1.5rem;transition:background .2s}
.gs-card:hover{background:rgba(255,255,255,.09)}
.gs-icon{font-size:1.5rem;display:block;margin-bottom:.8rem}
.gs-card h3{font-family:'Fraunces',serif;font-size:1rem;font-weight:700;margin-bottom:.4rem}
.gs-card p{font-size:.83rem;line-height:1.65;opacity:.5;font-weight:300}
.footer{padding:1.6rem 6%;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;font-size:.78rem;color:var(--gray)}
.footer-logo{font-family:'Fraunces',serif;font-weight:900;font-size:1.05rem;color:var(--brown)}
.footer-logo em{font-style:normal;color:var(--accent)}
.footer-right{display:flex;gap:1.5rem;align-items:center}
.footer-link{color:var(--gray);text-decoration:none;cursor:pointer}
.footer-link:hover{color:var(--accent);text-decoration:underline}
.admin-login{min-height:100vh;background:linear-gradient(135deg,#1a0f06,#3d2010);display:flex;align-items:center;justify-content:center;padding:1rem}
.admin-login-box{background:var(--cream);border-radius:22px;padding:2.8rem 2.4rem;max-width:380px;width:100%;text-align:center;box-shadow:0 32px 80px rgba(0,0,0,.45);margin:0 auto}
.alinput{width:100%;padding:.88rem 1rem;border:2px solid rgba(122,79,53,.2);border-radius:10px;font-family:inherit;font-size:.95rem;background:var(--cream);color:var(--brown);outline:none;margin-bottom:.8rem;box-sizing:border-box}
.alinput.err{border-color:var(--accent)}
.albtn{width:100%;background:var(--accent);color:#fff;font-family:inherit;font-size:1rem;font-weight:700;padding:.92rem;border-radius:10px;border:none;cursor:pointer}
.admin-page{min-height:100vh;background:var(--warm);padding:5rem 5% 3rem;animation:adminIn .4s ease}
.admin-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:.9rem 6%;display:flex;align-items:center;justify-content:space-between;background:rgba(46,26,15,.97)}
.admin-nav-logo{font-family:'Fraunces',serif;font-weight:900;font-size:1.2rem;color:#fff}
.admin-nav-logo em{font-style:normal;color:var(--accent)}
.admin-back{background:rgba(255,255,255,.1);color:#fff;font-family:inherit;font-size:.82rem;font-weight:600;padding:.45rem 1rem;border-radius:7px;border:1px solid rgba(255,255,255,.15);cursor:pointer}
.admin-inner{max-width:900px;margin:0 auto}
.admin-title{font-family:'Fraunces',serif;font-size:2rem;font-weight:900;margin-bottom:.3rem}
.admin-sub{font-size:.9rem;color:var(--gray);margin-bottom:2rem}
.admin-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:2rem}
.admin-stat{background:#fff;border-radius:14px;padding:1.2rem 1.4rem;border:1px solid var(--border)}
.admin-stat-n{font-family:'Fraunces',serif;font-size:2rem;font-weight:900;color:var(--accent);line-height:1;margin-bottom:.2rem}
.admin-stat-l{font-size:.78rem;color:var(--gray)}
.admin-table-wrap{background:#fff;border-radius:14px;border:1px solid var(--border);overflow-x:auto;-webkit-overflow-scrolling:touch}
.admin-table-head{padding:1rem 1.4rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.admin-table-title{font-family:'Fraunces',serif;font-size:1rem;font-weight:700}
.admin-badge-g{display:inline-block;background:var(--gl);color:var(--green);font-size:.68rem;font-weight:700;padding:.18rem .55rem;border-radius:20px}
.admin-table{width:100%;border-collapse:collapse}
.admin-table th{text-align:left;font-size:.72rem;font-weight:700;color:var(--gray);letter-spacing:.06em;text-transform:uppercase;padding:.7rem 1.4rem;border-bottom:1px solid var(--border);background:var(--cream)}
.admin-table td{padding:.85rem 1.4rem;font-size:.88rem;border-bottom:1px solid rgba(122,79,53,.07)}
.admin-table tr:last-child td{border-bottom:none}
.admin-table tr:hover td{background:var(--cream)}
.admin-empty{padding:3rem;text-align:center;color:var(--gray);font-size:.9rem}

@media(max-width:1024px){
  .hero-row{grid-template-columns:1fr 1fr;justify-items:center}
  .hero-row .phone:last-child{display:none}
}

@media(max-width:820px){
  .hero-row{grid-template-columns:1fr;justify-items:center}
  .hero-row .phone{display:none}
  .sec-inner,.sec-inner.rev,.prog-sec-inner{grid-template-columns:1fr;direction:ltr;text-align:center}
  .badge{display:none}
  .gs-grid,.admin-stats{grid-template-columns:1fr}
  .footer{flex-direction:column;gap:.5rem;text-align:center}
  .steps{align-items:center}
  .step{text-align:left}
}
`;

function PhoneCamera() {
  return (
    <div className="phone">
      <div className="phone-notch"/>
      <div className="phone-screen">
        <div className="ps-head">📸 Nufotografuok</div>
        <div className="cam-vf">
          <div className="cam-food">🥗</div><div className="cam-scan"/>
          <div className="cam-c tl"/><div className="cam-c tr"/>
          <div className="cam-c bl"/><div className="cam-c br"/>
          <div className="cam-dot"/>
        </div>
        <div className="hc">
          <div className="hc-top">
            <div className="hc-lbl">Sveikumo lygis</div>
            <div style={{display:"flex",alignItems:"baseline",gap:".12rem"}}><div className="hc-score">87</div><div className="hc-max">/100</div></div>
          </div>
          <div className="hc-food">🥗 Graikiškos salotos</div>
          <div className="hb-row">
            <div className="hb"><div className="hb-l">Kalorijos</div><div className="hb-t"><div className="hb-f k" style={{width:"52%"}}/></div><div className="hb-v">320</div></div>
            <div className="hb"><div className="hb-l">Baltymai</div><div className="hb-t"><div className="hb-f p" style={{width:"35%"}}/></div><div className="hb-v">8g</div></div>
            <div className="hb"><div className="hb-l">Riebalai</div><div className="hb-t"><div className="hb-f f" style={{width:"45%"}}/></div><div className="hb-v">14g</div></div>
            <div className="hb"><div className="hb-l">Angl.</div><div className="hb-t"><div className="hb-f c" style={{width:"68%"}}/></div><div className="hb-v">38g</div></div>
          </div>
          <div className="hc-badge good">✅ Sveikas pasirinkimas</div>
        </div>
      </div>
    </div>
  );
}

function PhoneAI() {
  return (
    <div className="phone">
      <div className="phone-notch"/>
      <div className="phone-screen">
        <div className="ps-head">AI padėjėjas 🤖</div>
        <div className="ub">Ar galiu vakare suvalgyti sūrelį?</div>
        <div className="ab"><div className="ab-lbl">Maistė AI</div><div className="ab-txt">Taip! Liko 370 kcal. Varškės sūrelis ~130 kcal 🧀</div></div>
        <div className="ub">Kiek kalorijų šaltibarščiuose?</div>
        <div className="ab"><div className="ab-lbl">Maistė AI</div><div className="ab-txt">400ml — apie 180–220 kcal 🥣</div></div>
      </div>
    </div>
  );
}

function PhotoPhone() {
  return (
    <div className="phone" style={{width:"240px"}}>
      <div className="phone-notch"/>
      <div className="phone-screen">
        <div className="ps-head">📸 Nuotrauka</div>
        <div className="cam-vf" style={{height:"130px"}}>
          <div className="cam-food" style={{fontSize:"3.8rem"}}>🍝</div><div className="cam-scan"/>
          <div className="cam-c tl"/><div className="cam-c tr"/>
          <div className="cam-c bl"/><div className="cam-c br"/>
          <div className="cam-dot"/>
        </div>
        <div className="hc">
          <div className="hc-top">
            <div className="hc-lbl">Sveikumo lygis</div>
            <div style={{display:"flex",alignItems:"baseline",gap:".12rem"}}><div className="hc-score">72</div><div className="hc-max">/100</div></div>
          </div>
          <div className="hc-food">🍝 Spagečiai bolognese</div>
          <div className="hb-row">
            <div className="hb"><div className="hb-l">Kalorijos</div><div className="hb-t"><div className="hb-f k" style={{width:"74%"}}/></div><div className="hb-v">620</div></div>
            <div className="hb"><div className="hb-l">Baltymai</div><div className="hb-t"><div className="hb-f p" style={{width:"55%"}}/></div><div className="hb-v">32g</div></div>
            <div className="hb"><div className="hb-l">Riebalai</div><div className="hb-t"><div className="hb-f f" style={{width:"60%"}}/></div><div className="hb-v">22g</div></div>
            <div className="hb"><div className="hb-l">Angl.</div><div className="hb-t"><div className="hb-f c" style={{width:"80%"}}/></div><div className="hb-v">68g</div></div>
          </div>
          <div className="hc-badge warn">⚠️ Daug angliavandenių</div>
        </div>
      </div>
    </div>
  );
}

function ProgressPhone() {
  const r = 42; const circ = 2 * Math.PI * r;
  return (
    <div className="prog-phone-wrap">
      <div className="prog-phone">
        <div className="prog-phone-notch"/>
        <div className="prog-phone-screen">
          <div className="prog-screen-head">
            <div className="prog-screen-title">Progresas 📊</div>
            <div className="prog-screen-sub">Savaitė</div>
          </div>
          <div className="prog-ring-wrap">
            <div style={{position:"relative",width:110,height:110}}>
              <svg viewBox="0 0 100 100" width="110" height="110">
                <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(122,79,53,.12)" strokeWidth="9"/>
                <circle cx="50" cy="50" r={r} fill="none" stroke="#d9603a" strokeWidth="9"
                  strokeDasharray={`${circ*.72} ${circ*.28}`} strokeLinecap="round" transform="rotate(-90 50 50)"/>
              </svg>
              <div className="prog-ring-center">
                <div className="prog-ring-num">1&nbsp;430</div>
                <div className="prog-ring-unit">iš 1800 kcal</div>
              </div>
            </div>
            <div className="prog-ring-liko">Liko: 370 kcal 🔥</div>
          </div>
          <div className="prog-macros">
            <div className="prog-mac"><div className="prog-mac-val">78g</div><div className="prog-mac-lbl">Baltymai</div></div>
            <div className="prog-mac"><div className="prog-mac-val">48g</div><div className="prog-mac-lbl">Riebalai</div></div>
            <div className="prog-mac"><div className="prog-mac-val">162g</div><div className="prog-mac-lbl">Angl.</div></div>
          </div>
          <div className="prog-tip">
            <div className="prog-tip-lbl">✨ AI Patarimas</div>
            <div className="prog-tip-txt">Liko 370 kcal — puikiai tiks lengva vakarienė 🍽️</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIChatMockup() {
  return (
    <div className="chat-mockup">
      <div className="chat-header">
        <div className="chat-avatar">🤖</div>
        <div><div className="chat-hname">Maistė AI</div></div>
      </div>
      <div className="chat-body">
        <div className="chat-msg user"><div className="chat-who">Jūs</div><div className="chat-bubble">Ką galiu valgyti vakarienei? Liko apie 400 kcal.</div></div>
        <div className="chat-msg ai"><div className="chat-who">Maistė AI</div><div className="chat-bubble">Kiaušinienė su daržovėmis (~280 kcal) ir graikiškas jogurtas (~120 kcal) 🥚🥗</div></div>
        <div className="chat-msg user"><div className="chat-who">Jūs</div><div className="chat-bubble">O jei noriu kažko saldaus?</div></div>
        <div className="chat-msg ai"><div className="chat-who">Maistė AI</div><div className="chat-bubble">Jogurtas su medum ir uogomis — tik ~180 kcal 🍯🫐</div></div>
      </div>
      <div className="chat-footer">
        <div className="chat-input-box">Rašykite klausimą...</div>
        <div className="chat-send">➤</div>
      </div>
    </div>
  );
}

function PcMockup() {
  return (
    <div className="pc-wrap">
      <div className="pc">
        <div className="pc-screen">
          <div className="pc-dots"><div className="pc-dot"/><div className="pc-dot"/><div className="pc-dot"/></div>
          <div className="pc-t">Jūsų tikslai šią savaitę</div>
          <div className="pc-stats">
            <div className="pc-stat"><div className="pc-sn">5/7</div><div className="pc-sl">Dienų tiksle</div></div>
            <div className="pc-stat"><div className="pc-sn">−0.4kg</div><div className="pc-sl">Šią savaitę</div></div>
            <div className="pc-stat"><div className="pc-sn">82%</div><div className="pc-sl">Baltymai</div></div>
          </div>
          <div className="pc-bars">
            {[["Kalorijos","1 430 / 1 800","79%"],["Baltymai","78 / 95g","82%"],["Riebalai","48 / 60g","80%"]].map(([l,v,w])=>(
              <div className="pc-bar" key={l}>
                <div className="pc-bl"><span>{l}</span><span>{v}</span></div>
                <div className="pc-bt"><div className="pc-bf" style={{width:w}}/></div>
              </div>
            ))}
          </div>
        </div>
        <div className="pc-stand"/><div className="pc-base"/>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin, onBack }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const submit = () => {
    if (pw === "maiste2026") { onLogin(); }
    else { setErr(true); setTimeout(() => setErr(false), 2000); }
  };
  return (
    <div className="admin-login">
      <div className="admin-login-box">
        <div style={{fontSize:"2.5rem",marginBottom:".5rem"}}>🔐</div>
        <div style={{fontFamily:"'Fraunces',serif",fontWeight:900,fontSize:"1.5rem",color:"#2e1a0f",marginBottom:".2rem"}}>
          Maistė<span style={{color:"#d9603a"}}>.</span> Admin
        </div>
        <div style={{fontSize:".85rem",color:"#a08878",marginBottom:"1.8rem"}}>Įveskite slaptažodį</div>
        <input type="password" placeholder="Slaptažodis" value={pw} onChange={e=>setPw(e.target.value)}
            className={`alinput${err?" err":""}`}/>
          {err && <div style={{color:"#d9603a",fontSize:".83rem",marginBottom:".7rem"}}>❌ Neteisingas slaptažodis</div>}
          <button onClick={submit} className="albtn">Prisijungti →</button>
        <button onClick={onBack} style={{marginTop:"1rem",background:"none",border:"none",color:"#a08878",fontSize:".82rem",cursor:"pointer",textDecoration:"underline"}}>← Grįžti</button>
      </div>
    </div>
  );
}

function AdminPanel({ regs, onBack }) {
  const fmt = iso => {
    const d = new Date(iso);
    return d.toLocaleDateString("lt-LT") + " " + d.toLocaleTimeString("lt-LT",{hour:"2-digit",minute:"2-digit"});
  };
  return (
    <>
      <nav className="admin-nav">
        <div className="admin-nav-logo">Maistė<em>.</em> Admin</div>
        <button className="admin-back" onClick={onBack}>← Grįžti į puslapį</button>
      </nav>
      <div className="admin-page">
        <div className="admin-inner">
          <h1 className="admin-title">📋 Registracijos</h1>
          <p className="admin-sub">Visi žmonės, kurie užsiregistravo į demo</p>
          <div className="admin-stats">
            <div className="admin-stat"><div className="admin-stat-n">{regs.length}</div><div className="admin-stat-l">Iš viso registracijų</div></div>
            <div className="admin-stat"><div className="admin-stat-n">{regs.filter(r=>r.name).length}</div><div className="admin-stat-l">Nurodė vardą</div></div>
            <div className="admin-stat"><div className="admin-stat-n">{regs.length > 0 ? fmt(regs[0].created_at).split(" ")[0] : "—"}</div><div className="admin-stat-l">Paskutinė registracija</div></div>
          </div>
          <div className="admin-table-wrap">
            <div className="admin-table-head">
              <div className="admin-table-title">Registracijų sąrašas</div>
              <span className="admin-badge-g">{regs.length} vnt.</span>
            </div>
            {regs.length === 0 ? (
              <div className="admin-empty">Registracijų dar nėra 🌿<br/><small style={{opacity:.6}}>Grįžkite ir užsiregistruokite</small></div>
            ) : (
              <table className="admin-table">
                <thead><tr><th>#</th><th>El. paštas</th><th>Vardas</th><th>Data</th></tr></thead>
                <tbody>
                  {regs.map((r,i)=>(
                    <tr key={r.id || i}>
                      <td style={{color:"var(--gray)",fontSize:".8rem"}}>{regs.length-i}</td>
                      <td><strong>{r.email}</strong></td>
                      <td style={{color:r.name?"var(--brown)":"var(--gray)"}}>{r.name||"—"}</td>
                      <td style={{color:"var(--gray)",fontSize:".82rem"}}>{fmt(r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [page, setPage] = useState("landing");
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [regName, setRegName] = useState("");
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  const fetchRegs = async () => {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setRegs(data);
  };

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    fetchRegs();
    return () => s.remove();
  }, []);

  const scrollToForm = () => {
    if (page !== "landing") {
      setPage("landing");
      setTimeout(() => document.getElementById("reg-form")?.scrollIntoView({behavior:"smooth",block:"center"}), 100);
    } else {
      document.getElementById("reg-form")?.scrollIntoView({behavior:"smooth",block:"center"});
    }
  };

  const handleSecretTap = () => {
    setTapCount(prev => {
      const next = prev + 1;
      if (next >= 5) { setPage("admin"); return 0; }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!email || loading) return;
    setLoading(true);
    
    const dn = name.trim() || email.split("@")[0];
    const { error } = await supabase
      .from('registrations')
      .insert([{ email: email, name: name.trim() || null }]);

    if (!error) {
      setRegName(dn);
      setEmail('');
      setName('');
      setPage("thanks");
      fetchRegs();
    }
    setLoading(false);
  };

  if (page === "admin") {
    if (!adminAuthed) return <AdminLogin onLogin={() => setAdminAuthed(true)} onBack={() => setPage("landing")}/>;
    return <AdminPanel regs={regs} onBack={() => setPage("landing")}/>;
  }

  if (page === "privacy") return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#1a0f06,#3d2010)",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem 1rem",fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:"#fdf8f2",borderRadius:24,padding:"3rem 2.5rem",maxWidth:600,width:"100%",boxShadow:"0 32px 80px rgba(0,0,0,.45)"}}>
        <h1 style={{fontFamily:"'Fraunces',serif",fontSize:"2rem",fontWeight:900,color:"#2e1a0f",marginBottom:"1.5rem",display:"flex",alignItems:"center",gap:".8rem"}}>
          <span style={{fontSize:"1.8rem"}}>🛡️</span> Privatumo politika
        </h1>
        
        <div style={{fontSize:".95rem",color:"#7a4f35",lineHeight:1.8,display:"flex",flexDirection:"column",gap:"1.2rem"}}>
          <p>
            <strong>1. Tikslas ir Rinkos Testavimas</strong><br/>
            Ši interneto svetainė yra skirta <strong style={{color:"#2e1a0f"}}>Maistė.</strong> projekto idėjos validacijai ir rinkos potencialo tyrimui. Svetainės tikslas – nustatyti vartotojų susidomėjimą būsima paslauga bei surinkti bandomąją grupę asmenų, norinčių išbandyti programėlės prototipą.
          </p>

          <p>
            <strong>2. Renkami Duomenys</strong><br/>
            Mes renkame minimalų kiekį asmens duomenų: jūsų el. pašto adresą bei (pasirinktinai) vardą. Šie duomenys yra saugomi saugioje duomenų bazėje, naudojant Supabase infrastruktūrą.
          </p>

          <p>
            <strong>3. Duomenų Naudojimas</strong><br/>
            Surinkta informacija bus naudojama išskirtinai šiems tikslams:
            <ul style={{marginTop:".5rem", paddingLeft:"1.2rem"}}>
              <li>Informuoti jus el. paštu apie programėlės startą.</li>
              <li>Pasiūlyti galimybę išbandyti prototipą.</li>
              <li>Gauti jūsų atsiliepimus (feedback), kurie padėtų tobulinti projektą.</li>
            </ul>
          </p>

          <p>
            <strong>4. Jūsų Teisės ir Duomenų Trynimas</strong><br/>
            Mes vertiname jūsų privatumą ir užtikriname, kad jūsų duomenys nebus perleisti trečiosioms šalims. Jūs turite teisę bet kuriuo metu pareikalauti, kad jūsų duomenys būtų neatstatomai ištrinti iš mūsų sistemų. Norėdami tai padaryti, tiesiog parašykite mums laisvos formos el. laišką adresu: <strong style={{color:"#d9603a"}}>maisteapp@gmail.com</strong>.
          </p>
        </div>

        <button onClick={() => {setPage("landing"); window.scrollTo(0,0);}} style={{marginTop:"2.5rem", width:"100%",background:"#d9603a",color:"#fff",fontFamily:"inherit",fontSize:"1rem",fontWeight:700,padding:".92rem",borderRadius:12,border:"none",cursor:"pointer",transition:"background .2s"}}>
          ← Grįžti į pagrindinį puslapį
        </button>
      </div>
    </div>
  );

  if (page === "thanks") return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#1a0f06,#3d2010)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:"#fdf8f2",borderRadius:22,padding:"2.8rem 2.4rem",maxWidth:380,width:"100%",textAlign:"center",boxShadow:"0 32px 80px rgba(0,0,0,.45)"}}>
        <div style={{fontSize:"2.5rem",marginBottom:".5rem"}}>🎉</div>
        <div style={{fontFamily:"'Fraunces',sans-serif",fontWeight:900,fontSize:"1.5rem",color:"#2e1a0f",marginBottom:".2rem"}}>
          Ačiū, {regName}!
        </div>
        <div style={{fontSize:".88rem",color:"#7a4f35",lineHeight:1.7,marginBottom:"1.6rem"}}>
          Esate tarp pirmų, kurie išbandys <strong style={{color:"#2e1a0f"}}>Maistė.</strong><br/>
          Parašysime kai programa bus paruošta. 🌿
        </div>
        <button onClick={() => setPage("landing")} style={{width:"100%",background:"#d9603a",color:"#fff",fontFamily:"inherit",fontSize:"1rem",fontWeight:700,padding:".92rem",borderRadius:10,border:"none",cursor:"pointer"}}>← Grįžti į puslapį</button>
      </div>
    </div>
  );

  return (
    <>
      <nav className="nav">
        <div className="nav-logo" style={{cursor:"pointer"}} onClick={() => {setPage("landing"); window.scrollTo(0,0);}}>Maistė<em>.</em></div>
        <div className="nav-right">
          <button className="nav-cta" onClick={scrollToForm}>Būkite tarp pirmų</button>
        </div>
      </nav>

      <section className="hero">
        <div className="blob b1"/><div className="blob b2"/><div className="blob b3"/>
        <div className="page-col">
  {/* Pakeičiame <p> į <div> konteinerį, kad galėtume turėti dvi atskiras eilutes */}
  <div className="hero-eyebrow-container fu">
    {/* Pirma eilutė: "Maistė." */}
    <div className="hero-eyebrow-title">
      <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: '1.2rem' }}>
        Maistė<em style={{ fontStyle: "normal", color: "var(--accent)" }}>.</em>
      </span>
    </div>
    {/* Antra eilutė: "Nauja lietuviška programėlė" */}
    <div className="hero-eyebrow-subtitle">
      Nauja lietuviška programėlė
    </div>
  </div>
          <h1 className="hero-h1 fu1">Žinokite, ką valgote.<br/><em>Kiekvieną dieną.</em></h1>
          <p className="hero-sub fu2">Nauja programėlė, sukurta tik <strong>Lietuvai!</strong> <br />  
          Atpažįsta lietuvišką maistą, bendrauja lietuviškai ir veikia su pažangia DI integracija. {" "}
          <strong> Nufotografuok </strong> patiekalą ir akimirksniu sužinok kalorijas, maistinę vertę bei porcijos dydį. {" "}
          Gauk <strong>individualius</strong> mitybos planus, naudingus patarimus ir išmanų AI padėjėją kasdieniams sprendimams. <br />
          Greita. {" "} Paprasta. {" "} Lietuviška.  🌿
          </p>
          <div className="hero-chips fu3">
            <div className="chip">📸 Nuotrauka arba tekstas</div>
            <div className="chip">🇱🇹 Lietuviški patiekalai</div>
            <div className="chip">🤖 AI padėjėjas</div>
            <div className="chip">⚡ Rezultatas per 5s</div>
          </div>
          <div className="hero-pills fu3">
            <div><div className="pill-val">100%</div><div className="pill-lbl">Lietuviškai</div></div>
            <div><div className="pill-val">5s</div><div className="pill-lbl">Suskaičiuoja</div></div>
          </div>
          <div className="hero-row fu4" id="reg-form">
            <PhoneCamera/>
            <div className="form-box">
              <p className="hf-title">Registruokitės į demo 🌿</p>
              <p className="hf-desc">Būsite tarp pirmų, kurie išbandys programėlę.</p>
              <div className="fg"><label>El. paštas <span className="req">*</span></label><input type="email" placeholder="jusu@gmail.com" value={email} onChange={e=>setEmail(e.target.value)}/></div>
                <div className="fg"><label>Vardas <span style={{fontWeight:400,opacity:.6}}>(neprivaloma)</span></label><input type="text" placeholder="Jūsų vardas" value={name} onChange={e=>setName(e.target.value)}/></div>
                <button onClick={handleSubmit} className="btn" disabled={loading}>{loading?"Siunčiama...":"Noriu išbandyti →"}</button>
                <p className="hf-note">
                🔒 <span style={{fontWeight: 700, color: "var(--brown)"}}>Jokio spam'o</span>, tik demo versija. Ištrinsime jūsų duomenis bet kuriuo metu, kreipkites: <span style={{fontWeight: 700, color: "var(--brown)"}}>maisteapp@gmail.com</span>.
                </p>
            </div>
            <PhoneAI/>
          </div>
        </div>
      </section>

      <section className="sec warm">
        <div className="sec-inner">
          <div>
            <p className="sec-tag">Kaip tai veikia?</p>
            <h2 className="sec-title">Nufotografuokite —<br/><em>AI parodo dienos likutį.</em></h2>
            <p className="sec-body">Nebereikia ieškoti kalorijų lentelėse. <strong>Tiesiog nufotografuokite</strong> ką valgote. AI atpažįsta ir <strong>suskaičiuoja viską per sekundes.</strong></p>
            <div className="steps">
              <div className="step"><div className="step-n">1</div><div className="step-t"><strong>Atidarykite kamerą</strong> ir nukreipkite į maistą</div></div>
              <div className="step"><div className="step-n">2</div><div className="step-t"><strong>AI atpažįsta patiekalą</strong> automatiškai</div></div>
              <div className="step"><div className="step-n">3</div><div className="step-t"><strong>Matote kalorijas, makroelementus</strong> ir sveikumo lygį</div></div>
            </div>
          </div>
          <div className="foto-wrap">
            <div className="foto-float">
              <div className="badge tl"><div className="bdg-l">Atpažinta per</div><div className="bdg-v"><em>3.2s</em> ⚡</div></div>
              <PhotoPhone/>
              <div className="badge br"><div className="bdg-l">Sveikumo lygis</div><div className="bdg-v"><em>72</em>/100</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec white">
        <div className="sec-inner rev">
          <div>
            <p className="sec-tag">AI padėjėjas</p>
            <h2 className="sec-title">Klauskite kaip<br/><em>gero draugo.</em></h2>
            <p className="sec-body"><strong>Tiesiog paklauskite lietuviškai</strong> — AI atsako per sekundes.</p>
            <div className="ai-examples">
              <div className="ai-ex">💬 <strong>„Kiek kalorijų šaltibarščiuose?"</strong></div>
              <div className="ai-ex">💬 <strong>„Ar galiu dar suvalgyti sūrelį?"</strong></div>
              <div className="ai-ex">💬 <strong>„Ką valgyti, kad gautum daugiau baltymų?"</strong></div>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"center"}}><AIChatMockup/></div>
        </div>
      </section>

      <section className="prog-sec">
        <div className="prog-sec-inner">
          <div>
            <p className="sec-tag">Progreso sekimas</p>
            <h2 className="sec-title">Sekite kalorijų balansą<br/><em>visą dieną</em></h2>
            <p className="sec-body">Matykite kiek suvalgėte ir kiek liko — realiu laiku.</p>
            <ul className="feat-list">
              <li>Aiški dienos suvestinė vienoje vietoje</li>
              <li>AI pataria ką valgyti pagal likusį balansą</li>
              <li>Savaitiniai ir mėnesiniai grafikai</li>
            </ul>
          </div>
          <ProgressPhone/>
        </div>
      </section>

      <section className="feat-section">
        <div className="feat-col">
          <div>
            <p className="sec-tag">Asmeniniai tikslai</p>
            <h2 className="sec-title">Nustatykite tikslą ir programa prisitaikys</h2>
            <p className="sec-body">Nesvarbu, ar norite numesti, palaikyti ar priaugti svorio — programa apskaičiuoja tinkamą kalorijų normą.</p>
            <ul className="feat-list">
              <li>Kalorijų norma pagal svorį, ūgį ir amžių</li>
              <li>Tinka norintiems numesti arba priaugti svorio</li>
              <li>Priminimų sistema</li>
            </ul>
          </div>
          <div style={{display:"flex",justifyContent:"center",width:"100%"}}><PcMockup/></div>
        </div>
      </section>

      <section className="grid-sec">
        <div className="grid-inner">
          <div className="gs-head">
            <p className="gs-tag">Visos funkcijos</p>
            <h2 className="gs-title">Viskas, ko reikia sveikam mitybos įpročiui</h2>
            <p className="gs-sub">Programa sukurta taip, kad naudotis būtų paprasta ir malonu</p>
          </div>
          <div className="gs-grid">
            {[["📸","Maisto nuotraukos","Nufotografuokite patiekalą ir AI suskaičiuos kalorijas."],["🇱🇹","Lietuviški patiekalai","Cepelinai, šaltibarščiai, kugelis ir šimtai kitų valgių."],["🤖","AI patarimai","Klauskite AI bet kurį mitybos klausimą lietuviškai."],["🎯","Asmeniniai tikslai","Programa prisitaiko prie jūsų tikslo."],["📊","Progresas ir grafikai","Dienos, savaitės ir mėnesio suvestinės."],["🔔","Priminimai","Programa primena įvesti valgius."]].map(([icon,title,desc])=>(
              <div className="gs-card" key={title}><span className="gs-icon">{icon}</span><h3>{title}</h3><p>{desc}</p></div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-logo" onClick={handleSecretTap} style={{cursor:"default",userSelect:"none"}}>Maistė<em>.</em></div>
        <div className="footer-right">
          <span className="footer-link" onClick={() => {setPage("privacy"); window.scrollTo(0,0);}}>Privatumo politika</span>
          <span>© 2026 Maistė · Lietuviška mitybos programėlė</span>
        </div>
      </footer>
    </>
  );
}