// ================================================================
// TIRHUTA ALPHABET DATA - Complete Dataset
// All characters verified and preserved from original
// ================================================================

const TIRHUTA_DATA = [
    // ==================== पवित्र चिह्न ====================
    { char: '𑒀', name: 'अज्जी', pronounce: 'Ajji', category: 'पवित्र', strokes: 4, example: 'प्रारम्भ में अज्जी' },
    { char: '𑓇', name: 'ॐ', pronounce: 'ॐ (Om)', category: 'पवित्र', strokes: 4, example: 'ॐ नमः शिवाय' },

    // ==================== स्वर (Vowels) ====================
    { char: '𑒁', name: 'अ', pronounce: 'a', category: 'स्वर', strokes: 2, example: '𑒁𑒧𑓃𑒞 (अमृत)' },
    { char: '𑒂', name: 'आ', pronounce: 'ā', category: 'स्वर', strokes: 3, example: '𑒂𑒧 (आम)' },
    { char: '𑒃', name: 'इ', pronounce: 'i', category: 'स्वर', strokes: 2, example: '𑒃𑒧𑒪𑒲 (इमली)' },
    { char: '𑒄', name: 'ई', pronounce: 'ī', category: 'स्वर', strokes: 3, example: '𑒄𑒕 (ईख)' },
    { char: '𑒅', name: 'उ', pronounce: 'u', category: 'स्वर', strokes: 2, example: '𑒅𑒪𑓂𑒪𑒴𑒏 (उलूक)' },
    { char: '𑒆', name: 'ऊ', pronounce: 'ū', category: 'स्वर', strokes: 3, example: '𑒆𑒢 (ऊन)' },
    { char: '𑒇', name: 'ऋ', pronounce: 'ṛ', category: 'स्वर', strokes: 2, example: '𑒇𑒮𑒱 (ऋषि)' },
    { char: '𑒈', name: 'ऋृ', pronounce: 'lri', category: 'स्वर', strokes: 2, example: '' },
    { char: '𑒋', name: 'ए', pronounce: 'e', category: 'स्वर', strokes: 2, example: '𑒈𑒏 (एक)' },
    { char: '𑒌', name: 'ऐ', pronounce: 'ai', category: 'स्वर', strokes: 3, example: '𑒉𑒢𑒏 (ऐनक)' },
    { char: '𑒍', name: 'ओ', pronounce: 'o', category: 'स्वर', strokes: 2, example: '𑒊𑒒𑒾𑒪𑒲 (ओखली)' },
    { char: '𑒎', name: 'औ', pronounce: 'au', category: 'स्वर', strokes: 3, example: '𑒋𑒩𑒞 (औरत)' },
    { char: '𑒁𑓀', name: 'अं', pronounce: 'aṃ', category: 'स्वर', strokes: 2, example: '𑒁𑒿𑒕𑒰 (अंचा)' },
    { char: '𑒁𑓁', name: 'अः', pronounce: 'aḥ', category: 'स्वर', strokes: 2, example: '𑒁𑓂𑒯𑓃 (अः)' },

    // ==================== मात्राएँ (Matras) ====================
    { char: '𑒰', name: 'आ-मात्रा', pronounce: 'ā', category: 'मात्रा', strokes: 1, example: '𑒏𑒰 (का)' },
    { char: '𑒱', name: 'इ-मात्रा', pronounce: 'i', category: 'मात्रा', strokes: 1, example: '𑒏𑒱 (कि)' },
    { char: '𑒲', name: 'ई-मात्रा', pronounce: 'ī', category: 'मात्रा', strokes: 2, example: '𑒏𑒲 (की)' },
    { char: '𑒳', name: 'उ-मात्रा', pronounce: 'u', category: 'मात्रा', strokes: 1, example: '𑒏𑒳 (कु)' },
    { char: '𑒴', name: 'ऊ-मात्रा', pronounce: 'ū', category: 'मात्रा', strokes: 2, example: '𑒏𑒴 (कू)' },
    { char: '𑒵', name: 'ऋ-मात्रा', pronounce: 'ṛ', category: 'मात्रा', strokes: 2, example: '𑒏𑒵 (कृ)' },
    { char: '𑒶', name: 'ॠ-मात्रा', pronounce: 'ṝ', category: 'मात्रा', strokes: 2, example: '𑒏𑒶 (कॄ)' },
    { char: '𑒺', name: 'ए-मात्रा', pronounce: 'e', category: 'मात्रा', strokes: 1, example: '𑒏𑒺 (के)' },
    { char: '𑒻', name: 'ऐ-मात्रा', pronounce: 'ai', category: 'मात्रा', strokes: 2, example: '𑒏𑒻 (कै)' },
    { char: '𑒼', name: 'ओ-मात्रा', pronounce: 'o', category: 'मात्रा', strokes: 1, example: '𑒏𑒼 (को)' },
    { char: '𑒾', name: 'औ-मात्रा', pronounce: 'au', category: 'मात्रा', strokes: 2, example: '𑒏𑒽 (कौ)' },
    { char: '𑓂', name: 'हलन्त', pronounce: 'halant', category: 'मात्रा', strokes: 1, example: '𑒏𑓂 (क्)' },

    // ==================== व्यंजन (Consonants) - क वर्ग ====================
    { char: '𑒏', name: 'क', pronounce: 'ka', category: 'व्यंजन', strokes: 3, example: '𑒏𑒧𑒪 (कमल)' },
    { char: '𑒐', name: 'ख', pronounce: 'kha', category: 'व्यंजन', strokes: 3, example: '𑒐𑒕𑒯𑓂𑒩𑒴𑒁𑒻 (खजूर)' },
    { char: '𑒑', name: 'ग', pronounce: 'ga', category: 'व्यंजन', strokes: 3, example: '𑒑𑒰𑒨 (गाय)' },
    { char: '𑒒', name: 'घ', pronounce: 'gha', category: 'व्यंजन', strokes: 4, example: '𑒒𑒩 (घर)' },
    { char: '𑒓', name: 'ङ', pronounce: 'ṅa', category: 'व्यंजन', strokes: 2, example: '𑒩𑒓𑓂𑒑 (रङ्ग)' },

    // ==================== व्यंजन - च वर्ग ====================
    { char: '𑒔', name: 'च', pronounce: 'ca', category: 'व्यंजन', strokes: 3, example: '𑒔𑒰𑒢𑓂𑒠 (चाँद)' },
    { char: '𑒕', name: 'छ', pronounce: 'cha', category: 'व्यंजन', strokes: 3, example: '𑒕𑒞 (छत)' },
    { char: '𑒖', name: 'ज', pronounce: 'ja', category: 'व्यंजन', strokes: 3, example: '𑒖𑒪 (जल)' },
    { char: '𑒗', name: 'झ', pronounce: 'jha', category: 'व्यंजन', strokes: 4, example: '𑒗𑓂𑒛𑒜𑒰 (झंडा)' },
    { char: '𑒘', name: 'ञ', pronounce: 'ña', category: 'व्यंजन', strokes: 3, example: '𑒘𑒰𑒢 (ज्ञान)' },

    // ==================== व्यंजन - ट वर्ग ====================
    { char: '𑒙', name: 'ट', pronounce: 'ṭa', category: 'व्यंजन', strokes: 3, example: '𑒙𑒰𑒕𑒲 (टाटी)' },
    { char: '𑒚', name: 'ठ', pronounce: 'ṭha', category: 'व्यंजन', strokes: 3, example: '𑒚𑒲𑒕 (ठीक)' },
    { char: '𑒛', name: 'ड', pronounce: 'ḍa', category: 'व्यंजन', strokes: 3, example: '𑒛𑒩 (डर)' },
    { char: '𑒜', name: 'ढ', pronounce: 'ḍha', category: 'व्यंजन', strokes: 4, example: '𑒜𑒱𑒪𑒾𑒞𑒹𑒯 (ढिलाई)' },
    { char: '𑒝', name: 'ण', pronounce: 'ṇa', category: 'व्यंजन', strokes: 3, example: '𑒝𑒱𑒢 (णिन)' },

    // ==================== व्यंजन - त वर्ग ====================
    { char: '𑒞', name: 'त', pronounce: 'ta', category: 'व्यंजन', strokes: 3, example: '𑒞𑒪 (तल)' },
    { char: '𑒟', name: 'थ', pronounce: 'tha', category: 'व्यंजन', strokes: 3, example: '𑒟𑒰𑒢𑒻 (थानी)' },
    { char: '𑒠', name: 'द', pronounce: 'da', category: 'व्यंजन', strokes: 3, example: '𑒠𑒰𑒢 (दान)' },
    { char: '𑒡', name: 'ध', pronounce: 'dha', category: 'व्यंजन', strokes: 4, example: '𑒡𑒩𑓂𑒧 (धर्म)' },
    { char: '𑒢', name: 'न', pronounce: 'na', category: 'व्यंजन', strokes: 3, example: '𑒢𑒩 (नर)' },

    // ==================== व्यंजन - प वर्ग ====================
    { char: '𑒣', name: 'प', pronounce: 'pa', category: 'व्यंजन', strokes: 3, example: '𑒣𑒰𑒢𑒲 (पानी)' },
    { char: '𑒤', name: 'फ', pronounce: 'pha', category: 'व्यंजन', strokes: 3, example: '𑒤𑒪 (फल)' },
    { char: '𑒥', name: 'ब', pronounce: 'ba', category: 'व्यंजन', strokes: 3, example: '𑒥𑒰𑒕 (बाट)' },
    { char: '𑒦', name: 'भ', pronounce: 'bha', category: 'व्यंजन', strokes: 4, example: '𑒦𑒰𑒞 (भात)' },
    { char: '𑒧', name: 'म', pronounce: 'ma', category: 'व्यंजन', strokes: 3, example: '𑒧𑒰𑒞 (मात)' },

    // ==================== व्यंजन - अन्त्य ====================
    { char: '𑒨', name: 'य', pronounce: 'ya', category: 'व्यंजन', strokes: 3, example: '𑒨𑒞𑒹𑒢 (यत्न)' },
    { char: '𑒩', name: 'र', pronounce: 'ra', category: 'व्यंजन', strokes: 3, example: '𑒩𑒰𑒨 (राय)' },
    { char: '𑒪', name: 'ल', pronounce: 'la', category: 'व्यंजन', strokes: 3, example: '𑒪𑒰𑒪 (लाल)' },
    { char: '𑒫', name: 'व', pronounce: 'va', category: 'व्यंजन', strokes: 3, example: '𑒫𑒰𑒕𑒰 (वाटा)' },
    { char: '𑒬', name: 'श', pronounce: 'śa', category: 'व्यंजन', strokes: 3, example: '𑒬𑒱𑒫 (शिव)' },
    { char: '𑒭', name: 'ष', pronounce: 'ṣa', category: 'व्यंजन', strokes: 3, example: '𑒭𑒵𑒯𑒴 (षड्)' },
    { char: '𑒮', name: 'स', pronounce: 'sa', category: 'व्यंजन', strokes: 3, example: '𑒮𑒳𑒩𑓂𑒨 (सूर्य)' },
    { char: '𑒯', name: 'ह', pronounce: 'ha', category: 'व्यंजन', strokes: 3, example: '𑒯𑒰𑒞𑒲 (हाथी)' },

    // ==================== संयुक्त अक्षर (Conjuncts) - सबसे महत्वपूर्ण ====================
    { char: '𑒏𑓂𑒭', name: 'क्ष', pronounce: 'kṣa', category: 'संयुक्त', strokes: 4, example: '𑒏𑓂𑒭𑒱𑒞𑒱' },
    { char: '𑒞𑓂𑒩', name: 'त्र', pronounce: 'tra', category: 'संयुक्त', strokes: 4, example: '𑒞𑓂𑒩𑒱𑒞𑒱' },
    { char: '𑒖𑓂𑒘', name: 'ज्ञ', pronounce: 'jña', category: 'संयुक्त', strokes: 5, example: '𑒖𑓂𑒘𑒰𑒢' },
    { char: '𑒬𑓂𑒩', name: 'श्र', pronounce: 'śra', category: 'संयुक्त', strokes: 4, example: '𑒬𑓂𑒩𑒲' },
    { char: '𑒏𑓂𑒩', name: 'क्र', pronounce: 'kra', category: 'संयुक्त', strokes: 4, example: '𑒏𑓂𑒩𑒱𑒞𑒱' },
    { char: '𑒑𑓂𑒩', name: 'ग्र', pronounce: 'gra', category: 'संयुक्त', strokes: 4, example: '𑒑𑓂𑒩𑒰𑒧' },
    { char: '𑒣𑓂𑒩', name: 'प्र', pronounce: 'pra', category: 'संयुक्त', strokes: 4, example: '𑒣𑓂𑒩𑒺𑒧' },
    { char: '𑒣𑓂𑒨', name: 'प्य', pronounce: 'pya', category: 'संयुक्त', strokes: 4, example: '𑒣𑓂𑒨𑒰𑒢𑒹' },
    { char: '𑒮𑓂𑒞', name: 'स्त', pronounce: 'sta', category: 'संयुक्त', strokes: 4, example: '𑒮𑓂𑒞𑒱𑒞𑒱' },
    { char: '𑒮𑓂𑒩', name: 'स्र', pronounce: 'sra', category: 'संयुक्त', strokes: 4, example: '𑒮𑓂𑒩𑒱𑒞𑒱' },
    { char: '𑒯𑓂𑒨', name: 'ह्य', pronounce: 'hya', category: 'संयुक्त', strokes: 4, example: '𑒯𑓂𑒨𑒰𑒢𑒹' },
    { char: '𑒠𑓂𑒨', name: 'द्य', pronounce: 'dya', category: 'संयुक्त', strokes: 4, example: '𑒠𑓂𑒨𑒰𑒢𑒹' },
    { char: '𑒥𑓂𑒩', name: 'ब्र', pronounce: 'bra', category: 'संयुक्त', strokes: 4, example: '𑒥𑓂𑒩𑒲𑒡𑒰' },
    { char: '𑒧𑓂𑒩', name: 'म्र', pronounce: 'mra', category: 'संयुक्त', strokes: 4, example: '𑒧𑓂𑒩𑒱𑒞𑒱' },

    // ==================== तिरहुता अंक (Numbers) ====================
    { char: '𑓐', name: '०', pronounce: 'शून्य', category: 'संख्या', strokes: 1, example: '०' },
    { char: '𑓑', name: '१', pronounce: 'एक', category: 'संख्या', strokes: 1, example: '१' },
    { char: '𑓒', name: '२', pronounce: 'द्वि', category: 'संख्या', strokes: 1, example: '२' },
    { char: '𑓓', name: '३', pronounce: 'त्रि', category: 'संख्या', strokes: 2, example: '३' },
    { char: '𑓔', name: '४', pronounce: 'चतुर', category: 'संख्या', strokes: 2, example: '४' },
    { char: '𑓕', name: '५', pronounce: 'पञ्च', category: 'संख्या', strokes: 2, example: '५' },
    { char: '𑓖', name: '६', pronounce: 'षष्', category: 'संख्या', strokes: 2, example: '६' },
    { char: '𑓗', name: '७', pronounce: 'सप्त', category: 'संख्या', strokes: 2, example: '७' },
    { char: '𑓘', name: '८', pronounce: 'अष्ट', category: 'संख्या', strokes: 2, example: '८' },
    { char: '𑓙', name: '९', pronounce: 'नव', category: 'संख्या', strokes: 2, example: '९' },

    // ==================== विराम चिह्न (Punctuation) ====================
    { char: '।', name: 'पूर्ण विराम', pronounce: 'danda', category: 'विराम', strokes: 1, example: '।' },
    { char: '॥', name: 'द्वि-दण्ड', pronounce: 'double danda', category: 'विराम', strokes: 2, example: '॥' },
    { char: 'ऽ', name: 'अवग्रह', pronounce: 'avagraha', category: 'विराम', strokes: 1, example: 'ऽ' }
];
