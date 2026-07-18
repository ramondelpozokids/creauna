import { buildAgencyPlanFromBrief } from '../app/lib/ai/agencyPipeline';

const brief = `Nombre
Kebab Hut
Título
Sabores auténticos que conquistan Madrid
Badge
AUTÉNTICO DONER KEBAB
ESPECIALIDADES
Doner Kebab
Durum
Falafel
Calle Pilar Nogueiro 2
no quiero una plantilla
Playfair Display
#D62828
GALERÍA
UBICACIÓN`;

const plan = buildAgencyPlanFromBrief(brief, 'es');
console.log(JSON.stringify(plan, null, 2));
if (plan.businessName !== 'Kebab Hut') process.exit(1);
if (!plan.heroTitle?.includes('Sabores')) process.exit(1);
if (!plan.specialties.includes('Durum')) process.exit(1);
console.log('OK plan extraction');
