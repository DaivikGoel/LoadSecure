// Import any necessary modules here
import { parse, splitSectionsByKeywords } from './modules/parse';
import { vetMC } from './modules/vetting';
import { NodeObserver } from './modules/observer';


// Start observing changes in the entire document's subtree
NodeObserver.observe(document, { childList: true, subtree: true });

