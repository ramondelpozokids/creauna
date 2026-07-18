import { buildAgencyPlanFromBrief } from '../app/lib/ai/agencyPipeline';
import { isFashionEcommercePrompt } from '../app/lib/ai/businessProfiles';
import { buildBriefImagePack } from '../app/lib/ai/promptFirstQuality';
import { readFileSync } from 'fs';
import { join } from 'path';

const brief = readFileSync(join(__dirname, 'fixtures/velora-brief.txt'), 'utf8');

console.log('fashion?', isFashionEcommercePrompt(brief));
const plan = buildAgencyPlanFromBrief(brief, 'es');
console.log(JSON.stringify(plan, null, 2));
const pack = buildBriefImagePack(brief, 'es');
console.log('variant', pack.variant, 'urls', pack.urls.length);

if (plan.businessName !== 'VELORA') {
  console.error('FAIL name', plan.businessName);
  process.exit(1);
}
if (!plan.heroTitle?.includes('elegancia')) {
  console.error('FAIL title', plan.heroTitle);
  process.exit(1);
}
if (pack.variant !== 'fashion') {
  console.error('FAIL variant', pack.variant);
  process.exit(1);
}
if (!plan.sections.includes('lookbook') || !plan.sections.includes('collection')) {
  console.error('FAIL sections', plan.sections);
  process.exit(1);
}
console.log('OK VELORA plan ready for studio test');
