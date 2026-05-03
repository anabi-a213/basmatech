// @basmatech/content — public surface

export { home, ar, en, getHome } from './home';
export type { LocaleCopy, ChapterCopy } from './home';

export { portfolio, getPortfolio } from './portfolio';
export type { PortfolioCopy, RoomCopy, RoomCase, FoyerCopy, ExitCopy, Lang } from './portfolio';

export { services, getServices } from './services';
export type { ServicesPageCopy, ServiceCopy, ServiceSlug } from './services';

export { tour, getTour } from './tour';
export type { TourCopy, TourProject, FoyerCopy as TourFoyerCopy, ClosingCopy, CorridorTint } from './tour';
