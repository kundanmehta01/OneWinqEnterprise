const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const listItems = (items, render) => items.length
  ? `<ul>${items.map(render).join('')}</ul>`
  : '';

/**
 * Builds a self-contained, printable identity card from data already available
 * on the public-profile page. This keeps a visitor's saved card useful even
 * when they later open it without a connection.
 */
export const downloadProfileIdentity = (profile) => {
  if (!profile) return;

  const skills = (profile.skills || []).map((item) => item.name || item).filter(Boolean);
  const experience = profile.experience || profile.journey || [];
  const projects = profile.projects || profile.workAndImpact?.projects || [];
  const achievements = profile.achievements || [];
  const socialLinks = (profile.socialLinks || []).filter((link) => link?.url);
  const phone = profile.connectAndContact?.phone || profile.phone || '';
  const email = profile.connectAndContact?.workEmail || profile.workEmail || '';
  const about = profile.about?.introduction || profile.bio || profile.headline || '';
  const profileUrl = window.location.href;
  const photo = profile.avatarUrl
    ? `<img class="avatar" src="${escapeHtml(profile.avatarUrl)}" alt="${escapeHtml(profile.name)}" />`
    : `<div class="avatar placeholder">${escapeHtml((profile.name || 'O').charAt(0))}</div>`;

  const documentHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(profile.name || 'OneWinq Profile')} · OneWinq</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#f7f5ff;color:#172033;font:15px Inter,Arial,sans-serif;line-height:1.55}.card{max-width:760px;margin:32px auto;padding:34px;background:#fff;border:1px solid #e9e3ff;border-radius:28px;box-shadow:0 18px 55px #3d187018}.hero{display:flex;gap:20px;align-items:center;padding-bottom:25px;border-bottom:1px solid #eee9fa}.avatar{width:88px;height:88px;border-radius:24px;object-fit:cover;background:#6d28d9;color:#fff;display:grid;place-items:center;font-size:34px;font-weight:800}.eyebrow{color:#6d28d9;font-size:11px;font-weight:800;letter-spacing:.11em;text-transform:uppercase}h1{margin:3px 0;font-size:30px;line-height:1.15}h2{font-size:15px;margin:26px 0 9px;color:#37116e}p{margin:0;color:#536077}ul{margin:0;padding-left:18px;color:#536077}li{margin:5px 0}.chips{display:flex;flex-wrap:wrap;gap:8px}.chip{padding:6px 10px;border-radius:999px;background:#f1edff;color:#5b21b6;font-size:12px;font-weight:700}.contact{display:grid;gap:5px}.contact a{color:#5b21b6;overflow-wrap:anywhere}.footer{margin-top:30px;padding-top:15px;border-top:1px solid #eee9fa;color:#7c6d9f;font-size:12px}@media print{body{background:#fff}.card{box-shadow:none;margin:0;border:0}}
</style></head><body><main class="card"><section class="hero">${photo}<div><div class="eyebrow">OneWinq Digital Identity</div><h1>${escapeHtml(profile.name || '')}</h1><p><strong>${escapeHtml(profile.designation || '')}</strong>${profile.companyName ? ` · ${escapeHtml(profile.companyName)}` : ''}</p></div></section>
${about ? `<section><h2>About</h2><p>${escapeHtml(about)}</p></section>` : ''}
${skills.length ? `<section><h2>Skills</h2><div class="chips">${skills.map((skill) => `<span class="chip">${escapeHtml(skill)}</span>`).join('')}</div></section>` : ''}
${experience.length ? `<section><h2>Experience</h2>${listItems(experience, (item) => `<li><strong>${escapeHtml(item.role || item.designation || item.title || '')}</strong>${item.company || item.organization ? ` · ${escapeHtml(item.company || item.organization)}` : ''}${item.period ? ` <small>(${escapeHtml(item.period)})</small>` : ''}</li>`)}</section>` : ''}
${projects.length ? `<section><h2>Projects</h2>${listItems(projects, (item) => `<li><strong>${escapeHtml(item.name || item.title || '')}</strong>${item.description ? ` — ${escapeHtml(item.description)}` : ''}</li>`)}</section>` : ''}
${achievements.length ? `<section><h2>Achievements</h2>${listItems(achievements, (item) => `<li><strong>${escapeHtml(item.title || item.name || '')}</strong>${item.issuer || item.organization ? ` · ${escapeHtml(item.issuer || item.organization)}` : ''}</li>`)}</section>` : ''}
${(phone || email || socialLinks.length) ? `<section><h2>Contact & Links</h2><div class="contact">${phone ? `<span>Phone: ${escapeHtml(phone)}</span>` : ''}${email ? `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>` : ''}${socialLinks.map((link) => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener">${escapeHtml(link.platform || 'Profile link')}</a>`).join('')}</div></section>` : ''}
<footer class="footer">Saved from OneWinq · <a href="${escapeHtml(profileUrl)}">Open live profile</a></footer></main></body></html>`;

  navigator.serviceWorker?.controller?.postMessage({ type: 'CACHE_PROFILE', url: profileUrl });
  const blob = new Blob([documentHtml], { type: 'text/html;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${(profile.slug || profile.name || 'onewinq-profile').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
};
