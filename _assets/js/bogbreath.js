
var $timer = '';
var $letters_timer = '';
var $dna_string_letters = 'ATGCTGTTGAATTTTAGGTCTCTGTTCAATGCGGGACATGCCAACAGGATCCGCAAACATCTGGTGCAATGTCTTTGTTCCAGGCATGGGCAACCTACAGAATCTCCCATTCAGCTGAAAGGCCATGACCTTCTAACGTTACAAAATTATAAAGCAGAGGAAATCGAATATTTGCTTTGGGCAGCATCGGATTTAAAAGAGAGAATCAAACACAAGAAGGAGCATTTGCCTTTGCTGCAAGGAAAATCCTTAGCAATGATTTTTGAAAAAAGAAGCACAAGGACTAGAATATCTACAGAGACAGGATTTGCTCTCCTTGGAGGTCATCCCTGTTTCCTCACACTGCAAGACATTCACCTGGGCATTAATGAGAGCATCATGGACACAGCACGAGTATTGTCAACCATGACAGATGCAATCCTAGCACGAGTCTATAAACAGGGTGATCTAGAGATGTTGGCACAAGAGGCCACAATCCCCGTGATAAATGGACTGTCAGATTTTGACCATCCTATCCAGATTTTGGCTGATTACCTTACACTTCAGGAACACTACGGATCTTTGAAAGGTTTGACACTCAGCTGGATAGGTGATGGAAATAATGTTCTGAATTCTATTATGCTGAGTGCTGCTAAATTTGGGATGGATCTGCACATTGCTACTCCAAAAGGCTTTGAGCCAGATCCCATGGTGATTCAAA';

$(document).ready(function(){
  // change drop-down menus to buttons for grandmasters
  if ($user_level === 'gb1kdvw3l') {
    $('#drakes').remove();
    $('#details #gene-description').css({'float': 'none', 'height': '200px', 'width': '608px'})
  	$('#overlay').show();
  	$('#congratulations').show();
  	$('#sdh').css('width', '94px').html('<button onclick="inspectGene(\'sdh\'); return false;" title="SDH" class="button">SDH</button>');
  	$('#myo').css('width', '94px').html('<button onclick="inspectGene(\'myo\'); return false;" title="MYO" class="button">MYO</button>');
  	$('#deep').css('width', '94px').html('<button onclick="inspectGene(\'deep\'); return false;" title="Dilute" class="button">Dilute</button>');
  	$('#otc').css('width', '94px').html('<button onclick="inspectGene(\'otc\'); return false;" title="OTC" class="button">OTC</button>');
  	$('#gpi').css('width', '94px').html('<button onclick="inspectGene(\'gpi\'); return false;" title="GPI" class="button">GPI</button>');
  	$('#nosespike').css('width', '94px').html('<button onclick="inspectGene(\'nosespike\'); return false;" title="Nose Spike" class="button">Nose Spike</button>');
	// fill background with G,A,T and Cs
    populateLetters();
  } else {
    $('#letters').remove();
  }
	
});

/*
 * Populate Letters Div
 * Fills a background div with G,A,T and Cs for some fancy animation during DNA sequencing
 *
 */
function populateLetters() {
  var $letters = '';
  var $word = '';
  var $left = 0;
  var $j, $max;
  var $letters_array = $dna_string_letters.split('');
  for (var $i = 0; $i < $letters_array.length/10; $i++) {
    $j = $i * 11;
    $max = $j + 10;
    $word = '';
    while ($j < $max) {
      $word += $letters_array[$j];
      $j++;
    }
    $letters += '<span>' + $word + '</span>'; 
  }
  $('#letters').html($letters);
}

/*
 * Close Congratulations Message Overlay
 * Hides initial congratulations message shown to grandmasters and prepares page for bog breath sequencing
 *
 */
function closeCongratulations() {
	$('#container').css('z-index', '10');
	$('#overlay').hide();
	$('#congratulations').hide();
  //$('#special-instructions').html('<ol><li>Research each gene by clicking it and reading about what it does in HEALTHY DRAKES.</li><li>Based on the description, select the gene that you think could be related to bog breath.</li><li>Click "Sequence it" to send a blood sample from BOG BREATH DRAKES to the lab for DNA sequencing!</li><li>When you find the allele that is different in bog breath drakes, translate the protein and find the exact difference!</li></ol>');
  $('#special-instructions').css({'background': 'url(_assets/img/otc-initial-state.png) no-repeat 0 20px'});
	$('#special-instructions').show();
}

/*
 * Close Special Instructions
 * Empties special instructions div
 *
 */
function closeSpecialInstructions(){
	$('#container').css('z-index', '10');
	$('#overlay').hide();
	$('#special-instructions').html('');
}

/*
 * Inspect Gene
 * Allele Descriptions for bog breath sequencing
 *
 */
function inspectGene($gene) {
  var $chromosome_top, $dna_top, $allele_desc;
  if ($gene == 'tail') {
    $chromosome_top = (tail.top - 16) + 'px';
    $dna_top = (((tail.top * 1000) - 60) * -1) + 'px';
    $allele_desc = '<h2>Tail</h2><p>The <em><strong>tail</strong></em> gene determines whether an adult drake will have a long tail, a short tail or a tail with a kink. The proteins made from the alleles for tail act as signals for cell growth.</p><p>The <em><strong>long tail</strong></em> allele codes for the long tail protein, which signals the development of muscles and vertebrae at the end of the spinal column.</p><p>The <em><strong>short </strong></em> allele codes for the short tail protein which does not stimulate as much growth of the tail.</p><p>The <em><strong>kinked tail</strong></em> allele encodes the kinked tail protein, which causes extra growth of some of the vertebrae in the central part of the tail.</p>';
  } else if ($gene == 'metallic') {
    $chromosome_top = (metallic.top - 16) + 'px';
    $dna_top = (((metallic.top * 1000) - 60) * -1) + 'px';
    $allele_desc = '<h2>Metallic</h2><p>The drake "Asip" gene codes for a signaling protein that controls the production of the color pigment melanin.  Drake scales have an upper and a lower layer.  When melanin is present in both scale layers, drake colors appear dull, not shiny.  When melanin is present only in the lower scale layer, drakes appear as a shiny, metallic color.  Metallic colored scales occur in drakes that have inherited a mutation in the Asip gene.</p>'
  } else if ($gene == 'wings') {
    $chromosome_top = (wings.top - 16) + 'px';
    $dna_top = (((wings.top * 1000) - 60) * -1) + 'px';
    $allele_desc = '<h2>Wings</h2><p>During human embryo development certain proteins are made that control the growth of different parts of the body. The Wnt1 protein is part of a signaling system that tells the cells which proteins to make to ensure that different body parts develop correctly.  Drakes with mutations in the Wnt1 gene fail to develop wings and exhibit the wingless trait.</p>';
  } else if ($gene == 'horns') {
    $chromosome_top = (horns.top - 16) + 'px';
    $dna_top = (((horns.top * 1000) - 63) * -1) + 'px';
    $allele_desc = '<h2>Horns</h2><p>The <em><strong>horns</strong></em> allele codes for a protein that is made in drake embryo in cells. The horns protein normally grows into a boney plate on the skull that forms the foundation for the growth of horns.</p><p>The <em><strong>hornless</strong></em> allele is a dominant mutation that prevents the development of the boney head plate in the drake embryo, and prevents the growth of horns in the adult drake.</p>';
  } else if ($gene == 'color') {
    $chromosome_top = (color.top - 16) + 'px';
    $dna_top = (((color.top * 1000) - 60) * -1) + 'px';
    $allele_desc = '<h2>Colorless</h2><p>Drake scale color, like human skin color and animal fur color, depends on multiple genes. These color genes control the formation of granules of melanin, the pigment that colors skin in many animals including humans. Melanin pigment granules are found in the scales covering the drake\'s body.</p><p>The <em><strong>colored</strong></em> allele codes for a protein enzyme called tyrosinase, which is required for making melanin, the pigment that colors the skin in many animals including humans.</p><p>The <em><strong>colorless</strong></em> allele codes for a defective tyrosinase enzyme, which prevents melanin production entirely. The result, as in humans and other species, is an albino animal.</p>';
  } else if ($gene == 'black') {
    $chromosome_top = (black.top - 16) + 'px';
    $dna_top = (((black.top * 1000) - 60) * -1) + 'px';
    $allele_desc = '<h2>Brown</h2><p>Drake scale color, like human skin color and animal fur color, depends on multiple genes. The color genes control the formation of granules of melanin, the pigment that colors skin in many animals including humans. Melanin pigment granules are found in the scales covering the drake\'s body.</p><p>The <em><strong>black</strong></em> allele causes large-sized pigment granules that make the scales appear black. </p><p>Drakes with the <em><strong>brown</strong></em> allele have very small pigment granules that make the drake\'s scales appear brown.</p>';
  } else if ($gene == 'forelimbs') {
    $chromosome_top = (forelimbs.top - 16) + 'px';
    $dna_top = (((forelimbs.top * 1000) - 60) * -1) + 'px';
    $allele_desc = '<h2>Forelimbs</h2><p>The drake Fgf10 gene codes for a growth factor protein that stimulates cells to divide at the correct times. A drake with a mutation in the Fgf10 gene cannot develop forelimbs because the mutant Fgf10 protein fails to stimulate forelimb growth at the right time.</p>';
  } else if ($gene == 'hindlimbs') {
    $chromosome_top = (hindlimbs.top - 16) + 'px';
    $dna_top = (((hindlimbs.top * 1000) - 60) * -1) + 'px';
    $allele_desc = '<h2>Hindlimbs</h2><p>The Pitx1 protein is a protein that controls the activation of certain genes that are needed to develop the hind limbs of a drake. A mutation in the Pitx gene produces a defective protein that does not activate the genes, and results in the hindlimbless drake trait.</p>';
  } else if ($gene == 'armor') {
    $chromosome_top = (armor.top - 16) + 'px';
    $dna_top = (((armor.top * 1000) - 60) * -1) + 'px';
    $allele_desc = '<h2>Armor</h2><p>Many adult drakes have five body armor plates covering their ribs.</p><p>In the drake embryo the <strong><em>A1</em></strong> allele makes the armor protein, which sits on the surface of the cells and sends signals that trigger the development of the body armor plates.</p><p>The <strong><em>a</em></strong> allele make a protein that signals less efficiently, resulting in fewer armor plates.</p>';
  } else if ($gene == 'sdh') {
    $chromosome_top = (sdh.top - 16) + 'px';
    $dna_top = (((sdh.top * 1000) - 62) * -1) + 'px';
    $allele_desc = '<h2>Mbp Sdhb</h2><p>The SDH enzyme is part of the electron transport chain, a series of chemical reactions that occur during respiration to produce ATP. The SDH protein transports electrons across the inner membrane of the mitochondrion. The electron transport chain operates in every cell in the body.</p>';
  } else if ($gene == 'myo') {
    $chromosome_top = (myo.top - 16) + 'px';
    $dna_top = (((myo.top * 1000) - 60) * -1) + 'px';
    $allele_desc = '<h2>Mbp Myo1f</h2><p>The MYO protein is a molecular motor that transports newly-made organelles to their destination inside cells. One end of the motor protein attaches to long, thin filaments that stretch across the cell and act like molecular roadways, and the other end attaches to the organelle. The MYO motor moves along the filament, dragging the organelle with it.</p>';
  } else if ($gene == 'deep') {
    $chromosome_top = (deep.top - 16) + 'px';
    $dna_top = (((deep.top * 1000) - 60) * -1) + 'px';
    $allele_desc = '<h2>Dilute</h2><p>Drake scale color, like skin or fur color, depends on multiple genes. These color genes control formation of granules of melanin, the pigment that colors skin in many animals including humans. Melanin pigment granules are found in the drake\'s body scales.</p><p>The <strong><em>deep</em></strong> allele codes for a motor protein that distributes melanin pigment granules. The protein made from the <strong><em>deep</em></strong> allele distributes melanin granules evenly inside the drake\'s scales, leading to a deep color.</p><p>The protein made from the <strong><em>dilute</em></strong> allele does not work as well, and most of the granules stay around the cell nucleus instead of being distributed evenly. This leads to a lighter shade of the drake\'s color.</p>';
  } else if ($gene == 'otc') {
    $chromosome_top = (otc.top - 16) + 'px';
    $dna_top = (((otc.top * 1000) - 54) * -1) + 'px';
    $allele_desc = '<h2>OTC</h2><p>Ammonia is a toxic byproduct of the natural breakdown of old proteins in cells. The ammonia is released into the blood and is removed by the liver. Animals (including humans) make enzymes in the liver that function to remove poisons from the blood.</p><p>The <em><strong>OTC</strong></em> allele makes a fully functioning liver enzyme that removes ammonia from the bloodstream efficiently.</p>';
  } else if ($gene == 'gpi') {
    $chromosome_top = (gpi.top - 16) + 'px';
    $dna_top = (((gpi.top * 1000) - 56) * -1) + 'px';
    $allele_desc = '<h2>GPI</h2><p>The GPI enzyme is active in the chemical pathway known as glycolysis, which breaks down molecules of glucose (the main sugar in food) to derive energy to make ATP. Glycolysis occurs in all cells, so GPI is active in all cells.</p>';
  } else if ($gene == 'nosespike') {
    $chromosome_top = (nosespike.top - 16) + 'px';
    $dna_top = (((nosespike.top * 1000) - 55) * -1) + 'px';
    $allele_desc = '<h2>Nose Spike</h2><p>In the embryo, the <em><strong>nose spike</strong></em> protein binds to DNA near several different genes. When it binds properly, it activates these genes to make the proteins that build the head and neck of the drake, including the proteins that make the nose spike.</p><p>The <em><strong>no nose spike</strong></em> allele has a mutation, and the protein that is made from it cannot bind to the right place in the DNA to stimulate the genes for pre-nose spike structures. As a result, the nose spike is not made.</p>';
  }


		// move magnifier to the desired position
		scrollViewport($chromosome_top, $dna_top);
		$('#special-instructions').unbind('click').bind('click', function(){sequenceGene($gene);}).css('cursor', 'pointer');
    $('#sequence-button p').html('Think this is the one? <button class="button" onclick="sequenceGene(\'' + $gene + '\'); return false;">Sequence It</button>');
    if ($('#sequence-button').css('display') == 'none') {
      $('#sequence-button').fadeIn('slow');
    }
    $('#gene-description').fadeIn().animate({scrollTop: 0}, 'fast');
    $('#gene-description').css('overflow-y', 'hidden').css('overflow-y', 'auto').html($allele_desc); // css changes prevent unecessary scrollbar from appearing

    updateDNASection($gene, true);
}

/*
 * Fade Letters
 * Fade randomly selected parts of the letters div during sequencing animation
 *
 */
function fadeLetters() {
	var $letters_length = $('#letters span').length + 1;
	var $random = Math.floor(Math.random() *  $letters_length);
	$('#letters span:nth-child(' + $random + ')').css({'display': 'none', 'visibility': 'visible'}).fadeTo('slow', 100, function(){$(this).contents().unwrap();});
	$letters_timer = setTimeout('fadeLetters()', 55);
}

/*
 * Sequence Gene
 * First step in sequencing of DNA animation/processing
 *
 */
function sequenceGene($gene) {
  $('#special-instructions').css({'background': '#fff', 'cursor': 'default'}).unbind('click');
	$('#special-instructions').html('<img id="logo" src="_assets/img/geniverse.png" alt="Geniverse" /><p>Sending blood samples from bog breath drakes to sequencing lab for analysis...</p><p><img src="_assets/img/loading.gif" alt="loading..." /></p>');
	$('#prepare').fadeIn('slow');
	clearTimeout($timer);
	$timer = setTimeout('extract(\'' + $gene + '\')', 5000);
}

/*
 * Extract
 * Second step in sequencing of DNA animation/processing
 *
 */
function extract($gene) {
	$('#special-instructions').html('<img id="logo" src="_assets/img/geniverse.png" alt="Geniverse" /><p>Sending blood samples from bog breath drakes to sequencing lab for analysis...</p><p>Extracting DNA from bog breath drakes blood samples...</p><p><img src="_assets/img/loading.gif" alt="loading..." /></p>');
	clearTimeout($timer);
	$timer = setTimeout('sequence(\'' + $gene + '\')', 5000);
}

/*
 * Sequence
 * Third step in sequencing of DNA animation/processing
 *
 */
function sequence($gene) {
	$('#special-instructions').html('<img id="logo" src="_assets/img/geniverse.png" alt="Geniverse" /><p>Sending blood samples from bog breath drakes to sequencing lab for analysis...</p><p>Extracting DNA from bog breath drakes blood samples...</p><p>Sequencing DNA from bog breath drakes...</p><p><img src="_assets/img/loading.gif" alt="loading..." /></p>');
	clearTimeout($timer);
	$timer = setTimeout('assemble(\'' + $gene + '\')', 5000);
}

/*
 * Assemble
 * Fourth step in sequencing of DNA animation/processing
 *
 */
function assemble($gene) {
	$('#letters').show();
	$letters_timer = setTimeout('fadeLetters()', 10);
	$('#special-instructions').html('<img id="logo" src="_assets/img/geniverse.png" alt="Geniverse" /><p>Sending blood samples from bog breath drakes to sequencing lab for analysis...</p><p>Extracting DNA from bog breath drakes blood samples...</p><p>Sequencing DNA from bog breath drakes...</p><p>Assembling DNA for <span style="color: #c00;">' + $gene.toUpperCase() + ' gene</span> in bog breath drakes...</p><p><img src="_assets/img/loading.gif" alt="loading..." /></p>');
	clearTimeout($timer);
	$timer = setTimeout('results(\'' + $gene + '\')', 7000);
}

/*
 * Results
 * Fifth step in sequencing of DNA animation/processing. Display results of sequencing.
 *
 */
function results($gene) {
	    if ($gene === 'otc') {
		  $('#special-instructions').html('<img id="logo" src="_assets/img/geniverse.png" alt="Geniverse" /><p>Sending blood samples from bog breath drakes to sequencing lab for analysis...</p><p>Extracting DNA from bog breath drakes blood samples...</p><p>Sequencing DNA from bog breath drakes...</p><p>Assembling DNA for <span style="color: #c00;">' + $gene.toUpperCase() + ' gene</span> in bog breath drakes...</p><p><strong>DNA sequencing result:</strong><br />The bog breath drakes\' <span style="color: #c00;">OTC gene</span> is different from healthy drakes. You have found a different allele for OTC.</p><p class="link"><button title="Continue" onclick="correctSelection(\'' + $gene + '\'); return false;" class="button">Continue</button></p>');
	    } else {
		  $('#special-instructions').html('<img id="logo" src="_assets/img/geniverse.png" alt="Geniverse" /><p>Sending blood samples from bog breath drakes to sequencing lab for analysis...</p><p>Extracting DNA from bog breath drakes blood samples...</p><p>Sequencing DNA from bog breath drakes...</p><p>Assembling DNA for <span style="color: #c00;">' + $gene.toUpperCase() + ' gene</span> in bog breath drakes...</p><p><strong>DNA sequencing result:</strong><br />The sequence of the <span style="color: #c00;">' + $gene.toUpperCase() + ' gene</span> in bog breath drakes is identical to the sequence in healthy drakes.</p><p class="link"><button title="Continue" onclick="incorrectSelection(\'' + $gene + '\'); return false;" class="button">Continue</button></p>');
        }
	clearTimeout($timer);
	clearTimeout($letters_timer);
	$('#letters').html('');
	populateLetters();
}

/*
 * Incorrect Selection
 * Thrown when incorrect gene is sequenced
 *
 */
function incorrectSelection($gene) {
	$('#letters').hide();
  $('#letters span').css({'display': 'none', 'visibility': 'hidden'})
  $('#sequence-button p').html('Looks like that\'s not the one. Try again.');
	$('#special-instructions').css({'background': 'url(_assets/img/otc-initial-state.png) no-repeat 0 20px'}).unbind('click').click(function() { closeSpecialInstructions(); return false;});
	$('#' + $gene + ' button').attr('disabled', 'disabled').addClass('disabled');
  populateLetters();
}

/*
 * Correct Selection
 * Thrown when correct gene is sequenced
 *
 */
function correctSelection($gene) {
	$('#otc').html('<form action="#"><select id="otc-menu" onChange="changeGene(\'otc\');"><option value="">OTC alleles:</option><option value="otc">OTC</option><option value="otc-bog-breath">OTC Bog Breath</option><option value="compare-otc+otc-bog-breath" selected="selected">Compare</option></select></form>');
	$('#sequence-button').hide();
	$('#letters').hide();
	$('#special-instructions').hide();
	$('#labels button').attr('disabled', 'disabled').addClass('disabled');
	changeGene($gene);
  $('#gene-description').hide();
  $('#otc-question').show();
}

/*
 * Check OTC Answer
 * Check answer to OTC question asked after sequencing
 *
 */
function checkOTCAnswer() {
  if ($('input[name=otcq]:checked').val() == 4) {
    createFirework(25,187,5,1,null,null,null,null,false,true);
    $('#overlay').fadeIn('fast');
    $('#correct').fadeIn('slow');
  } else {
    alert("Sorry. That's not correct.");
  }
}

/*
 * Fanfare
 * Display the special end message in a new window/tab
 *
 */
function fanfare() {
  window.open('correct.html', 'flying', 'width=1024, height=600, toolbar=true, addressbar=true, scrollbars=true,resizable=true');
}