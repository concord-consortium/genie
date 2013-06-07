// get page file name
var $page_url = window.location.pathname;
var $page_url_pieces = $page_url.split('/');
var $page_name = $page_url_pieces.pop();

// check for otc value in URL
var $otc_type = getParameter('otc');

// initialize global variables
var $enable_more, $user_level, $access_genes;

$(document).ready(function () {
	
	// get user level from URI
	$user_level = getParameter('ul');
	$access_genes = checkAccessLevel($user_level);

	// reset select menus to default state, but only if OTC has not been sequenced ($otc_type == 2)
	if ($otc_type != 2) {
		$('select option:first-child').attr('selected', 'selected');
	} else {
  		$('#sdh-menu option:nth-child(3), #myo-menu option:nth-child(3), #gpi-menu option:nth-child(3)').text('Same allele in bog breath drakes').css('color', '#999999');
  		$('#otc-menu option:nth-child(3)').remove();
  		$('#otc-menu').append('<option value="otc-bog-breath">OTC - Bog Breath</option><option value="compare-otc+otc-bog-breath">Compare</option>');
  		$('#otc-menu option:nth-child(4)').attr('selected', 'selected');
  		$('#otc-dna').append('<div class="hidden">' + otc.alleles[1].dna_seq + '</div>');
  		changeGene('otc');
	}

	// make magnifier draggable
	$('#magnifier').draggable({
		axis: "y",
		cursor: "pointer",
		containment: "parent",
		drag: function(event, ui) {
			var magnifier_top = ui.position.top;
			moveDNAToEquivalentLocation(magnifier_top);
		}
	});

	// add click event listener to More button
	$('#more').click(function () {
		sendMore(60);
	});

	// add text selector handler
	//$('.gene div').bind("mouseup", TextSelector.Selector.mouseup);

});

/*
 * Change Gene
 * Handles animation due to gene selection and prepares data for sending to the genie
 *
 */
function changeGene($gene) {
	
	var $scroll_to_gene = true;
	
	// get gene name from the menu id
	if ($gene == '' || $gene == undefined) {
	  $('select').each(function(i){
		  if ($('#' + this.id + ' option:selected').val() != '') {
			  $gene = this.id.replace('-menu', '');
		  }
	  });
	}
	
	// make sure they have access to this particular gene
	var $access = -1;
	for (var $i = 0; $i < $access_genes.length; $i++) {
		if ($gene == $access_genes[$i]) {
			$access = 1;
			break;
		}
	}

	if ($access == 1) {
		
		if ($('#' + $gene + '-menu option:selected').val().indexOf('compare') !== -1) {
		  $('#' + $gene + '-dna div.first em').css({'background-color': '#ff0000 !important'});
		} else {
		  $('#' + $gene + '-dna div.first em').css({'background-color': 'transparent'});
		}
		
		if ($('#' + $gene + '-menu option:selected').val().indexOf('sequence') !== -1) {
		  window.location = 'sequence.html?ul=' + $user_level + '&gene=' + $gene;
		  $scroll_to_gene = false;
		}
	}

	// hide applet if visible
	$('#details applet').css('left', '-999em');
	
	// hide video links if visible
	$('#video-links').fadeOut();
	
	// update more button
	$('#more').removeAttr("disabled");
	$('#more').unbind('click');
	$('#more').click(function(){
		sendMore(60, $gene);
	});

	// update reset button
	$('#reset').unbind('click');
	$('#reset').click(function(){
		resetDNA($gene);						   
	});
	
	// move dna section to appropriate gene and prepare to update genie with dna sequence
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
		$allele_desc = '<h3>Horns</h3><p>The <em><strong>horns</strong></em> allele codes for a protein that is made in drake embryo in cells. The horns protein normally grows into a boney plate on the skull that forms the foundation for the growth of horns.</p><p>The <em><strong>hornless</strong></em> allele is a dominant mutation that prevents the development of the boney head plate in the drake embryo, and prevents the growth of horns in the adult drake.</p>';
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
		$allele_desc = '<h2>Mbp Sdhb</h2><p>Mbp Sdhb enzyme in electron transport chain in mitochondria. The succinate dehydrogenase enzyme transfers electrons in the mitochondrial electron transport chain.</p>';
	} else if ($gene == 'myo') {
		$chromosome_top = (myo.top - 16) + 'px';
		$dna_top = (((myo.top * 1000) - 60) * -1) + 'px';
		$allele_desc = '<h2>Mbp Myo1f</h2><p>Mbp Myo1f motor protein that moves organelles. The myosin IF motor proteins move cargo including membrane bound organelles along actin fibers in the cell.</p>';
	} else if ($gene == 'deep') {
		$chromosome_top = (deep.top - 16) + 'px';
		$dna_top = (((deep.top * 1000) - 60) * -1) + 'px';
		$allele_desc = '<h2>Dilute</h2><p>Drake scale color, like human skin color and animal fur color, depends on multiple genes. These color genes control the formation of granules of melanin, the pigment that colors skin in many animals including humans. Melanin pigment granules are found in the scales covering the drake\'s body.</p><p>The <strong><em>deep</em></strong> allele (also sometimes called <strong><em>full</em></strong>) codes for a motor protein that distributes melanin pigment granules. The protein made from the <strong><em>deep</em></strong>  allele distributes melanin granules evenly inside the scales covering the drake\'s body, leading to a deep color.</p><p>The protein made from the <strong><em>dilute</em></strong>  allele does not work as well, and most of the granules stay around the nucleus of the cell instead of being distributed evenly. This leads to a lighter shade of the drake\'s color.</p>';
	} else if ($gene == 'otc') {
		$chromosome_top = (otc.top - 16) + 'px';
		$dna_top = (((otc.top * 1000) - 54) * -1) + 'px';
		$allele_desc = '<h2>OTC</h2><p>Ammonia is a toxic byproduct of the natural breakdown of old proteins in cells. The ammonia is released into the blood and is removed by the liver. Animals (including humans) make enzymes in the liver that function to remove poisons from the blood.</p><p>The <em><strong>OTC</strong></em> allele makes a fully functioning liver enzyme that removes ammonia from the bloodstream efficiently.</p><p>The <em><strong>bog breath</strong></em> allele makes a defective liver enzyme that cannot remove ammonia from the blood. This causes a dangerous accumulation of ammonia in the body with life-threatening disease symptoms.</p>';
	} else if ($gene == 'gpi') {
		$chromosome_top = (gpi.top - 16) + 'px';
		$dna_top = (((gpi.top * 1000) - 56) * -1) + 'px';
		$allele_desc = '<h2>GPI</h2><p>Gpi enzyme in glycolysis. The glucose-6-phosphate isomerase enzyme catalyzes the conversion of glucose-6-phosphate into fructose 6-phosphate in the second biochemical reaction in glycolysis.</p>';
	} else if ($gene == 'nosespike') {
		$chromosome_top = (nosespike.top - 16) + 'px';
		$dna_top = (((nosespike.top * 1000) - 55) * -1) + 'px';
		$allele_desc = '<h2>Nose Spike</h2><p>In the embryo, the <em><strong>nose spike</strong></em> protein binds to DNA near several different genes. When it binds properly, it activates these genes to make the proteins that build the head and neck of the drake, including the proteins that make the nose spike.</p><p>The <em><strong>no nose spike</strong></em> allele has a mutation, and the protein that is made from it cannot bind to the right place in the DNA to stimulate the genes for pre-nose spike structures. As a result, the nose spike is not made.</p>';
	}

	if ($scroll_to_gene) {
	
		// move magnifier to the desired position
		scrollViewport($chromosome_top, $dna_top);
		
		// change background image of applet containers
		$('.header').text('');
		if ($access == 1) {
			$('#app-container').css({'background-image': 'url(_assets/img/click-state.png)'});
			$('#app-container2').css({'background-image': 'url(_assets/img/click-state2.png)'}).fadeOut();
			$('#gene-description').fadeIn().animate({scrollTop: 0}, 'fast');
			$('#gene-description').css('overflow-y', 'hidden').css('overflow-y', 'auto').html($allele_desc); // css changes prevent unecessary scrollbar from appearing
			updateDNASection($gene);
		} else {
			$('#app-container').css({'background-image': 'url(_assets/img/unauthorized.png)'});
		}
	}
}

/*
 * Scroll Viewport
 * Handles animation of viewport slider
 *
 */
function scrollViewport($chromosome_top, $dna_top) {
	// move magnifier to the desired position
	$('#magnifier').css('background-position', '0 -37px');
	$('#magnifier').animate({
		'top': $chromosome_top
		}, 1000);
	$('#dna').animate({
		'top': $dna_top
		}, 1000, function(){
			$('#magnifier').css('background-position', '0 0');	
		});	
}

/*
 * Stop Codon Check
 * Checks for stop codons in a DNA sequence. Stop codons are TAG, TAA and TGA
 *
 */
function stopCodonCheck($dna_string) {
	// strip MW command from code
	$dna_string = $dna_string.replace('mw2d:1:stop; select atom all; remove; set DNA ', '');
	// strip HTML from string
	$dna_string = $dna_string.replace(/<(?:.|\n)*?>/gm, '');
	var $stop_codon = false;

	// split string into arrray of three-letter groupings and check for stop codon matches
	var $dna_string_array = $dna_string.match(/[\s\S]{1,3}/g) || [];
	for (var $i = 0; $i <= $dna_string_array.length; $i++) {
		if ($dna_string_array[$i] == 'TAG' || $dna_string_array[$i] == 'TAA' || $dna_string_array[$i] == 'TGA') {
			$stop_codon = $dna_string_array[$i];
		}
	}

	// disable More button
	if ($stop_codon) {
		if ($('#more').attr('disabled') !== 'disabled') {
			$('#more').attr('disabled', 'disabled');
		}
	}

	// return stop codon value
	return $stop_codon;
}

/*
 * Send DNA Strand
 * Sends the specified sequence of DNA to the genie
 *
 */
function sendDNAStrand($applet_id, $dna_strand, $dna_string, $dna_div) {
	// remove dashes
	var regex = new RegExp('_', 'g');
	$dna_strand = $dna_strand.replace(regex, '');
	
	// make sure to scroll to correct gene
	var $gene_line_id = $dna_div.replace('-dna', '-line');
	var $gene_line_pos = $($gene_line_id).position().top;
	if ($gene_line_pos > $('#magnifier').position().top + 16 || $gene_line_pos < $('#magnifier').position().top + 23) {
		var $gene_line_snap = $gene_line_pos - 16;
		var $dna_snap = (($gene_line_pos * 1000) - 60) * -1;
		scrollViewport($gene_line_snap, $dna_snap);
	}
	// update genie area with please wait message
	$('#app-container').unbind('click');
	$('#app-container2').unbind('click');
	$('#app-container').css({'background-image': 'url(_assets/img/wait.png)'});
	$('#app-container2').css({'background-image': 'url(_assets/img/click-state2.png)'});

	// highlight string of dna sent
	$($dna_div + ' div.first span').removeClass('highlighted');
	$($dna_div + ' div.hidden span').removeClass('highlighted');
	highlightSequence($dna_string, $dna_div);

	// send DNA strand to genie
	document.getElementById($applet_id).runMwScript($dna_strand);

	// reveal applet
	var applet_timer = setTimeout('showApplet()', 3000);

	// check for stop codons
	var $stop_codon = stopCodonCheck($dna_string);
	if ($stop_codon) {
		//alert('This DNA sequence contains the stop codon ' + $stop_codon + '.');
	}
}

/*
 * Send Next DNA Strand
 * Sends the specified sequence of DNA to the genie and performs extra tasks related to the "More" button
 *
 */
function sendNextDNAStrand($applet_id, $dna_strand) {
	// remove dashes
	$dna_strand = $dna_strand.replace('_', '');

	// check for stop codons
	var $stop_codon = stopCodonCheck($dna_strand);

	// disable more button during animation
	$('#more').attr('disabled', 'disabled');
	if (!$stop_codon) {
		if ($dna_strand.length >= 105) {
			$enable_more = setTimeout('enableMore()', 1000);
		}
	} else {
		//alert('This DNA sequence contains the stop codon ' + $stop_codon + '.');
	}

	// send DNA strand to genie
	document.getElementById($applet_id).runMwScript($dna_strand);
}

/*
 * Enable More
 * Enables the send more button
 *
 */
function enableMore() {
	$('#more').removeAttr('disabled');
	clearTimeout($enable_more);
}

/*
 * Show Applet
 * Reveals the applet and video links
 *
 */
function showApplet() {
	$('#details applet').css('left', '-23px');
	$('#video-links').fadeIn();
}

/*
 * Unfold
 * Sends unfold command to applet
 *
 */
function unfold(applet_id) {
	var $codestring = "mw2d:1:set %startPos %width/2 - %number_of_atoms*3/2; set %i 0; while (%i < %number_of_atoms); set atom[%i].restraint 100; set atom[%i].restraint.x %startPos+%i*3; set atom[%i].restraint.y %height/2; %i++; endwhile;";
	document.getElementById(applet_id).runMwScript($codestring);
	document.getElementById('applet2').runMwScript($codestring);
}

/*
 * Refold
 * Sends fold command to applet
 *
 */
function refold(applet_id) {
	var $codestring = "mw2d:1:set %i 0; while (%i < %number_of_atoms); set atom[%i].restraint 0; %i++; endwhile;";
	document.getElementById(applet_id).runMwScript($codestring);
	document.getElementById('applet2').runMwScript($codestring);
}

/*
 * Reset DNA
 * Resets the genie completely
 *
 */
function resetDNA($gene) {
	// reset applets
	$('#app-container .applet-wrap').html('');
	$('#app-container .applet-wrap').html('<applet id="applet" archive="mwapplet.jar" code="org.concord.modeler.MwApplet" width="680" height="550" mayscript="true" scroll="no"><param name="script" value="page:0:import P2GGenie.cml" /></applet>');
	$('#app-container2 .applet-wrap').html('');
	$('#app-container2 .applet-wrap').html('<applet id="applet2" archive="mwapplet.jar" code="org.concord.modeler.MwApplet" width="680" height="550" mayscript="true" scroll="no"><param name="script" value="page:0:import P2GGenie.cml" /></applet>');
	$('.header').text('');
	$('#gene-description').fadeOut();
	changeGene($gene);
}

/*
 * Highlight Sequence
 * Highlights the specified sequence of DNA letters
 *
 */
function highlightSequence($word, $dna_div) {
	// wrap specified DNA sequence in a span.highlighted
    var $rgxp = new RegExp($word, 'g');
    var $repl = '<span class="highlighted">' + $word + '</span>';
    $($dna_div + ' div.first').html($($dna_div + ' div.first').html().replace($rgxp, $repl));

	if (($dna_div != '#otc-dna') && ($otc_type != '2') && ($dna_div != '#sdh-dna') && ($dna_div != '#myo-dna') && ($dna_div != '#gpi-dna')) {
    	$($dna_div + ' div.hidden').html($($dna_div + ' div.hidden').html().replace($rgxp, $repl));
		$($dna_div + ' div.first span.highlighted').effect('pulsate', { times: 4 }, 200);
		$($dna_div + ' div.hidden span.highlighted').effect('pulsate', { times: 4 }, 200);
	}
	// scroll DNA section up if necessary
	if ($('span.highlighted').position()) {
	  var $highlight_top = $('span.highlighted').position().top;
	  if ($highlight_top > $('#container').height() - (($('span.highlighted').height() + 5) * 2)) {
	    var $dna_top = $('#dna').position().top - ($('span.highlighted').height() + 5);
	    $dna_top = $dna_top + 'px';
	    $('#dna').animate({'top': $dna_top}, 500);
	  }
	}
}

/*
 * Send More
 * Sends the specified sequence of DNA letters to the genie
 *
 */
function sendMore($start_num, $gene) {
	var $dna_string = '';
	var $dna_string2 = '';
	var $selected_option_text = $('#' + $gene + '-menu option:selected').text();
	var $selected_option_value = $('#' + $gene + '-menu option:selected').val();

	if ($selected_option_text !== 'Select one:') {
		$dna_div = '#' + $gene + '-dna';
		if ($selected_option_value.search('compare') <= -1) {
			$dna_string = $seqs[$selected_option_value];
			$orig_dna_string = $dna_string;
			$dna_string = $dna_string.replace(/<\/?[^>]+>/gi, '');
		} else {
			$selected_option_value_array = $selected_option_value.replace('compare-', '').split('+');
			$dna_string = $seqs[$selected_option_value_array[0]];
			$orig_dna_string = $dna_string;
			$dna_string = $dna_string.replace(/<\/?[^>]+>/gi, '');
			$dna_string2 = $seqs[$selected_option_value_array[1]];
			$orig_dna_string2 = $dna_string2;
			$dna_string2 = $dna_string2.replace(/<\/?[^>]+>/gi, '');
		}
	}

	$dna_string = $dna_string.substr($start_num, 60);
	$orig_dna_string = $orig_dna_string.substr($start_num, 69);
	if ($orig_dna_string.indexOf('<') == -1) {
		$orig_dna_string = $dna_string;
	}
	$dna_string2 = $dna_string2.substr($start_num, 60);
	var $next_num = $start_num + 60;
	$('#more').unbind('click');
	$('#more').html('Send Next 60 Letters');
	$('#more').click(function(){
		sendMore($next_num, $gene);
	});
	if ($dna_string.length < 60) {
		$('#more').attr('disabled', 'disabled');
	}
	sendNextDNAStrand('applet', 'mw2d:1:stop; select atom all; remove; set DNA ' + $dna_string);

	// highlight string of dna sent
	$($dna_div + ' div.first span').removeClass('highlighted');
	$($dna_div + ' div.hidden span').removeClass('highlighted');
	highlightSequence($orig_dna_string, $dna_div);

	if ($selected_option_value.search('compare') > -1) {
		sendNextDNAStrand('applet2', 'mw2d:1:stop; select atom all; remove; set DNA ' + $dna_string2);
	}

}

/*
 * Update DNA Section
 * Updates the drake images and prepares specified DNA sequence for sending to the genie
 *
 */
function updateDNASection($gene, $inspect) {
	$inspect = typeof $inspect !== 'undefined' ? $inspect : false; // $inspect is FALSE unless specified TRUE
	var $drake_img1, $drake_img2, $selected_option_text, $selected_option_value, $other_option_value;

	if ($inspect) {
		$selected_option_text = $gene;
		$selected_option_value = $gene;
	} else {
		$selected_option_text = $('#' + $gene + '-menu option:selected').text();
		$selected_option_value = $('#' + $gene + '-menu option:selected').val();
	}
	
	// make sure we have a value to compare in the case this is not a compare request (all alleles need to indicate where they differ from other alleles for the same gene, so we still need to compare single alleles to their sister alleles when showing them)
	if ($('#' + $gene + '-menu option:selected').index() == 1) {
		$other_option_value = $('#' + $gene + '-menu option:selected').next().val();
	} else {
		$other_option_value = $('#' + $gene + '-menu option:selected').prev().val();
	}
	
	// reset all select menus except selected
	$('select').each(function(i){
		var n = this.id.search($gene);
		if (this.id.search($gene) <= -1) {
			$('#' + this.id + ' option:first-child').attr('selected', 'selected');
		}
	});
	
	// image replacement
	$('#drakes').css('width', '362px');
	$('#drakes p').css('float', 'left');

	if ($selected_option_value || $inspect) {
		if ($selected_option_value.search('compare') <= -1) {
			$drake_img1 = $selected_option_value + '.png';
		} else {
			if ($selected_option_value == 'compare') { // two alleles only
				$drake_img1 = $('#' + $gene + '-menu option:nth-child(2)').val() + '.png';
				$drake_img2 = $('#' + $gene + '-menu option:nth-child(3)').val() + '.png';
			} else { // three or more alleles
				$selected_option_value_array = $selected_option_value.replace('compare-', '').split('+');
				$drake_img1 = $selected_option_value_array[0] + '.png';
				$drake_img2 = $selected_option_value_array[1] + '.png';
			}
		}
	}
	$('#drakes p em').fadeIn();
	var $dna_seqs = [];
	if ($selected_option_value || $inspect) {
		if ($selected_option_value.search('compare') == -1) {
			$dna_seqs = compareAlleleSeqs($gene, $selected_option_value, $other_option_value);
			$('#' + $gene + '-dna div.first').html($dna_seqs[0]);
			$('#drake img').attr('src', '_assets/img/drakes/' + $drake_img1);
			$('#' + $gene + '-dna div.hidden').css('display', 'none');
			$dna_string = $seqs[$selected_option_value];
			// accommodate <em> tags in string
			if ($dna_string.substring(0, 60).indexOf('<em>') != -1) {
				$highlight = $dna_string.substring(0, 69);
			} else {
				$highlight = $dna_string.substring(0, 60);
			}
			$dna_string = $dna_string.replace(/<\/?[^>]+>/gi, '');
			$dna_string = $dna_string.substring(0, 60);
			$('#container').animate({'height': '660px'});
			$('#app-container2').fadeOut();
			$('#drake2').fadeOut();
			$('#app-container').unbind('click');
			$('#app-container').click(function(){
				sendDNAStrand('applet', 'mw2d:1:stop; select atom all; remove; set DNA ' + $dna_string, $highlight, '#' + $gene + '-dna');
				$('#app-container .header').html($selected_option_text).fadeIn();
				$('#app-container2 .header').html($selected_option_text).fadeIn();
			});
		} else {
			$('#container').animate({'height': '1012px'});
			$('#app-container2').fadeIn();
			if ($selected_option_value == 'compare') {
				$dna_seqs = compareAlleleSeqs($gene, $('#' + $gene + '-menu option:nth-child(2)').val(), $('#' + $gene + '-menu option:nth-child(3)').val());
				$('#' + $gene + '-dna div.first').html($dna_seqs[0]);
				$('#' + $gene + '-dna div.hidden').html($dna_seqs[1]).css('display', 'block');
			} else {
				$selected_option_value_array = $selected_option_value.replace('compare-', '').split('+');
				$dna_seqs = compareAlleleSeqs($gene, $selected_option_value_array[0], $selected_option_value_array[1]);
				$('#' + $gene + '-dna div.first').html($dna_seqs[0]);
				$('#' + $gene + '-dna div.hidden').html($dna_seqs[1]).css('display', 'block');
			}
			$('#drake img').attr('src', '_assets/img/drakes/' + $drake_img1);
			$('#drake2 img').attr('src', '_assets/img/drakes/' + $drake_img2);
			$('#drake2').css('display', 'inline');
			$dna_string = $seqs[$('#' + $gene + '-menu option:nth-child(2)').val()];
			// accommodate <em> tags in string
			if ($dna_string.substring(0, 60).indexOf('<em>') != -1) {
				$highlight = $dna_string.substring(0, 69);
			} else {
				$highlight = $dna_string.substring(0, 60);
			}
			$highlight = $dna_string.substring(0, 69);
			$dna_string = $dna_string.replace(/<\/?[^>]+>/gi, '');
			$dna_string = $dna_string.substring(0, 60);
			$dna_string2 = $seqs[$('#' + $gene + '-menu option:nth-child(3)').val()];
			// accommodate <em> tags in string
			if ($dna_string2.substring(0, 60).indexOf('<em>') != -1) {
				$highlight = $dna_string2.substring(0, 69);
			} else {
				$highlight = $dna_string2.substring(0, 60);
			}
			$dna_string2 = $dna_string2.replace(/<\/?[^>]+>/gi, '');
			$dna_string2 = $dna_string2.substring(0, 60);
			$('#app-container').unbind('click');
			$('#app-container').click(function(){
				sendDNAStrand('applet', 'mw2d:1:stop; select atom all; remove; set DNA ' + $dna_string, $highlight, '#' + $gene + '-dna');
				sendDNAStrand('applet2', 'mw2d:1:stop; select atom all; remove; set DNA ' + $dna_string2, $highlight, '#' + $gene + '-dna');
				$('#app-container .header').html($selected_option_value_array[0]).fadeIn();
				$('#app-container2 .header').html($selected_option_value_array[1]).fadeIn();
			});
			$('#app-container2').unbind('click');
			$('#app-container2').click(function(){
				sendDNAStrand('applet', 'mw2d:1:stop; select atom all; remove; set DNA ' + $dna_string, $highlight, '#' + $gene + '-dna');
				sendDNAStrand('applet2', 'mw2d:1:stop; select atom all; remove; set DNA ' + $dna_string2, $highlight, '#' + $gene + '-dna');
			});
		}
	}
}

/* 
 * Compare Alleles
 * Compares two given alleles and marks location of the difference(s)
 */
function compareAlleleSeqs($gene, $allele1, $allele2) {
	$return_seqs_array = [];
	
	// initialize array for keeping track of differences
	var $diff = [];
	
	// create arrays of letters from allele sequences
	var $allele1_array = $seqs[$allele1].split('');
	if (!($allele2 === '') && !($allele2 === undefined)) {
		var $allele2_array = $seqs[$allele2].split('');
	
	// compare first allele to second allele and note location of differences
	for (var $i = 0; $i < $allele1_array.length; $i++) {
		if ($allele1_array[$i] !== $allele2_array[$i]) {
			$diff.push($i);
		}
	}

	// update arrays so that letters at location of difference are surrounded by EM tags, then join arrays into string and update allele values
	for (var $j = 0; $j < $diff.length; $j++) {
			$allele1_array[$diff[$j]] = '<em>' + $allele1_array[$diff[$j]] + '</em>';
	}
	$return_seqs_array.push($allele1_array.join('').replace('</em><em>', ''));
	for (var $j = 0; $j < $diff.length; $j++) {
			$allele2_array[$diff[$j]] = '<em>' + $allele2_array[$diff[$j]] + '</em>';
	}
	$return_seqs_array.push($allele2_array.join('').replace('</em><em>', ''));
	
	} else {
		$return_seqs_array.push($allele1_array.join(''));
	}
	// return values
	return $return_seqs_array;
}

/* 
 * Get Parameter
 * Returns value of specified variable if variable exists in URI query string
 */
function getParameter(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null) {
    return "";
  } else {
    return decodeURIComponent(results[1].replace(/\+/g, " "));
  }
}

/* 
 * Text Selector
 * Text selection initialization and functions
 */
if (!window.TextSelector) {
	TextSelector = {};
}

TextSelector.Selector = {};
TextSelector.Selector.getSelected = function() {
	var t = '';
	if (window.getSelection) {
		t = window.getSelection();
	} else if (document.getSelection) {
		t = document.getSelection();
	} else if (document.selection) {
		t = document.selection.createRange().text;
	}
	return t;
}

TextSelector.Selector.mouseup = function(e) {
	if ($('#custom').css('display') != 'block') {
		var st = TextSelector.Selector.getSelected();
		if (st != '') {
			$('#custom').css({'left': e.pageX - 150, 'top': e.pageY + 10});
			$('#more').attr('disabled', 'disabled');
			$('#custom').bind('click', function() {
				sendNextDNAStrand('applet', 'mw2d:1:stop; select atom all; remove; set DNA ' + st);
	
				// reveal applet
				$('#app-container').unbind('click');
				$('#app-container2').unbind('click');
				$('#app-container').css({'background-image': 'url(_assets/img/wait.png)'});
				$('#app-container2').css({'background-image': 'url(_assets/img/click-state2.png)'});
				var applet_timer = setTimeout('showApplet()', 3000);
	
				$('#custom').fadeOut('slow');
			}).fadeIn('fast');
		}
	} else {
		$('#custom').fadeOut('slow');
	}
};

/*
 * Check Access Level
 * Determines the current user's access level
 *
 */
function checkAccessLevel($user_level) {
	  // specify which genes can be accessed by which levels here
      /* ax7fpr9z0 = apprentice
	   * jbk53901s = journeyman
	   * mb9jql659 = master
	   * gb1kdvw3l = grandmaster
	   */
	  $access_genes = {
						  'ax7fpr9z0': {
							  			'genes': ['metallic', 'wings', 'horns', 'forelimbs', 'hindlimbs'], 
										'labels': ['tail', 'nosespike']
						  				},
						  'jbk53901s': {
							  			'genes': ['tail', 'metallic', 'wings', 'horns', 'forelimbs', 'hindlimbs', 'nosespike'], 
										'labels': ['armor']
						  				},
						  'mb9jql659': {
							  		'genes': ['tail', 'metallic', 'wings', 'horns', 'black', 'forelimbs', 'hindlimbs', 'armor', 'deep', 'nosespike'],
									'labels': []
						  			},
						  'gb1kdvw3l': {
							  		'genes': ['tail', 'metallic', 'wings', 'horns', 'color', 'black', 'forelimbs', 'hindlimbs', 'armor', 'deep', 'nosespike', 'otc', 'sdh', 'myo', 'gpi'], 
									'labels': []
						  			}
						  };
						  
	// temporary fix for preventing all but grandmasters from accessing certain armor alleles
	if ($user_level != 'gb1kdvw3l') {
		$('#armor-menu option:nth-child(7)').remove();
		$('#armor-menu option:nth-child(5)').remove();
		$('#armor-menu option:nth-child(3)').remove();
	}
	
	if ($user_level != 'ax7fpr9z0' && $user_level != 'jbk53901s' && $user_level != 'mb9jql659' && $user_level != 'gb1kdvw3l') {
		$access_array = [];
		$('#labels').empty();
		$('#overlay').fadeIn('fast');
		$('#access-denied').fadeIn('slow');
	} else {
	  
	  // update nav links with user level value
	  $('#nav a').each(function(i) {
		  this.href = this.href + '?ul=' + $user_level;
	  });
	  
	  // determine access levels for current user
	  var $access_array = $access_genes[$user_level]['genes'];
	  var $labels_array = $access_genes[$user_level]['labels'];
	  
	  // turn off genes that user should not have access to
	  $('select').each(function(i){
		  var $select_id = this.id;
		  var $match = -1;
		  for (var $i = 0; $i < $access_array.length; $i++) {
			  if ($select_id.search($access_array[$i]) >= 0) {
				  $match = 1;
			  }
		  }
		  if ($match == -1) {
			  var $gene_name = $select_id.replace('-menu', '');
			  var $label_match = -1;
			  for (var $j = 0; $j < $labels_array.length; $j++) {
					if ($labels_array[$j] == $gene_name) {
						$label_match = 1;
					}
			  }
			  
			  if ($label_match == 1) {
				  $('#' + $select_id).parent().html('<div id="' + $gene_name + '-menu" class="disabled" onclick="changeGene(\'' + $gene_name + '\');">' + $gene_name + '</div>');
				  $('#' + $gene_name + '-dna').html('<div>??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????&nbsp;Access Denied&nbsp;???<br />???&nbsp;Insufficient&nbsp;???<br />????&nbsp;Privileges&nbsp;????<br />????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</div>');
			  } else {
				  $('#' + $gene_name).remove();
			  }
		  }
	  });
	  
	  // show lines for potential bog breath genes
	  if ($user_level == 'gb1kdvw3l') {
		  $('#lines').show();
	  }
	}
	return $access_array;
}

/*
 * Genes and Allele Creation
 * Here's where we create the gene objects and assign alleles and the allele sequences
 *
 */

// tail
var tail = new Gene('tail', '60');
tail.addAllele('long', 'ATGGGTGTGTTTGAACTCCAGATCCACTCCTTCACCACAAGCAGCCCCCGAAACCTATGCCACGGGGTCCGCCCCTGCCGCATCTTCTTCCGCGTCTGCCTCAAACATGCCCAAGCCGTGGTGTCCCCGGAGCCCCCTTGCACCTTCGGGGCAGCCCTTAGCGATATCGTCCCTGCGGACCGCAACACAGTGGCCACCAGCACACCCATCCGGGTCCCCTTCCATTTCAAGTGGCCGGGGACATTTTCCCTCATTATTGAATCCTGGAGGGCTGAGTCAGGGGAGCCATCAACAGAGGATGCCCAGAGGCTGATCAGCCGCTTGGCCACCCGCCGCCGCCTGGCCGTCGGTGAAGACTGGTCGCAAGATGTGCAACTGGGAGACCAGAGCGAGCTGCGCTACTCCTACCATGTCACCTGCGACGAGCACTACTATGGGGAGAGCTGCTCGGACTATTGCCGGCCGCGGGACGATACCTTTGGGCACTACAGCTGTGACGAACTGGGCAGCCGGATCTGCTTAGCAGGGTGGCGGGGCGAATATTGCTCCGAGCCTGTTTGTTTGCCCGGCTGCAGCCACAGCCACGGGTTCTGCGAGAAGCCCGGTGAGTGCAAGTGCCGCATCGGCTGGCAGGGCCCCCTCTGCGATGCCTGCGTCCGCTACCCGGGCTGCCTCCACGGGACCTGCGCCCAGCCCTGGCAGTGCAACTGTCGGGAAGGCTGGGGCGGGCTCTTCTGCAACCAGGACCTCAACTATTGCACCAACCACCGTCCCTGCAAGAACGGGGCCACCTGCACCAACACGGGCCAAGGGAGCTACACCTGCGGCTGCCGGGCTGGCTTTGCGGGCACCAGCTGCGAGATGGAGATCAATGAGTGCGACAGCAACCCCTGCAAGAACGGAGGCAGCTGCAACGACCTGGAGAATGACTACAAATGCACCTGTCCTCAAGGCTTCTACGGCAAGAATTGTGAAATCAGTGCCATGACCTGCGCTGACGGACCGTGTTTCAATGGCGGGACTTGCATTGAGAAGCACTTGGGTGGCTACAGTTGTCACTGCCCAGTCAACTACCATGGCTCCAATTGCGAGAAGAAGATAGACCGATGTAGTAACAACCCTTGCTTGAACAACGGCCACTGTCTGGATCTGGGCCGCAGCATGATCTGCAAATGCCGCCCGGGCTTCGTTGGCTCCTTCTGTGAGCTGAACATCGACGACTGCGCGGGCAACCCATGTGCCAATGGAGGCACCTGCATTGATGGTCCAAACAGCTACACCTGTTCTTGCACATTGGGCTACGGTGGGAAGGACTGCAGCACCCGCATGGATGCCTGTGGCTCCAGCCCCTGCTTGAACAGCGGCACTTGCTATACCCACTTCTCCGGCCACGTCTGCGAGTGTTCGGCAGGCTACATGGGTTCCAACTGTGAATTCAAAGTTCAGATCCCAACCCCTGTTAGCAGCCAACGGGTGGCCGAAAGCCCTTTCCCTGTTGCACTAGCTGTTTCCTTTACTCTGGGCCTCATGATGTTGGTGCTTGCCGCCTGTGCCACCGCAGCAATGCTTCGGCACATGAGG');
tail.addAllele('short', 'ATGGGTGTGTTTGAACTCCAGATCCACTCCTTCACCACAAGCAGCCCCTGAAACCTATGCCACGGGGTCCGCCCCTGCCGCATCTTCTTCCGCGTCTGCCTCAAACATGCCCAAGCCGTGGTGTCCCCGGAGCCCCCTTGCACCTTCGGGGCAGCCCTTAGCGATATCGTCCCTGCGGACCGCAACACAGTGGCCACCAGCACACCCATCCGGGTCCCCTTCCATTTCAAGTGGCCGGGGACATTTTCCCTCATTATTGAATCCTGGAGGGCTGAGTCAGGGGAGCCATCAACAGAGGATGCCCAGAGGCTGATCAGCCGCTTGGCCACCCGCCGCCGCCTGGCCGTCGGTGAAGACTGGTCGCAAGATGTGCAACTGGGAGACCAGAGCGAGCTGCGCTACTCCTACCATGTCACCTGCGACGAGCACTACTATGGGGAGAGCTGCTCGGACTATTGCCGGCCGCGGGACGATACCTTTGGGCACTACAGCTGTGACGAACTGGGCAGCCGGATCTGCTTAGCAGGGTGGCGGGGCGAATATTGCTCCGAGCCTGTTTGTTTGCCCGGCTGCAGCCACAGCCACGGGTTCTGCGAGAAGCCCGGTGAGTGCAAGTGCCGCATCGGCTGGCAGGGCCCCCTCTGCGATGCCTGCGTCCGCTACCCGGGCTGCCTCCACGGGACCTGCGCCCAGCCCTGGCAGTGCAACTGTCGGGAAGGCTGGGGCGGGCTCTTCTGCAACCAGGACCTCAACTATTGCACCAACCACCGTCCCTGCAAGAACGGGGCCACCTGCACCAACACGGGCCAAGGGAGCTACACCTGCGGCTGCCGGGCTGGCTTTGCGGGCACCAGCTGCGAGATGGAGATCAATGAGTGCGACAGCAACCCCTGCAAGAACGGAGGCAGCTGCAACGACCTGGAGAATGACTACAAATGCACCTGTCCTCAAGGCTTCTACGGCAAGAATTGTGAAATCAGTGCCATGACCTGCGCTGACGGACCGTGTTTCAATGGCGGGACTTGCATTGAGAAGCACTTGGGTGGCTACAGTTGTCACTGCCCAGTCAACTACCATGGCTCCAATTGCGAGAAGAAGATAGACCGATGTAGTAACAACCCTTGCTTGAACAACGGCCACTGTCTGGATCTGGGCCGCAGCATGATCTGCAAATGCCGCCCGGGCTTCGTTGGCTCCTTCTGTGAGCTGAACATCGACGACTGCGCGGGCAACCCATGTGCCAATGGAGGCACCTGCATTGATGGTCCAAACAGCTACACCTGTTCTTGCACATTGGGCTACGGTGGGAAGGACTGCAGCACCCGCATGGATGCCTGTGGCTCCAGCCCCTGCTTGAACAGCGGCACTTGCTATACCCACTTCTCCGGCCACGTCTGCGAGTGTTCGGCAGGCTACATGGGTTCCAACTGTGAATTCAAAGTTCAGATCCCAACCCCTGTTAGCAGCCAACGGGTGGCCGAAAGCCCTTTCCCTGTTGCACTAGCTGTTTCCTTTACTCTGGGCCTCATGATGTTGGTGCTTGCCGCCTGTGCCACCGCAGCAATGCTTCGGCACATGAGG');
tail.addAllele('kink', 'ATGGGTGTGTTTAAACTCCAGATCCACTCCTTCACCACAAGCAGCCCCCGAAACCTATGCCACGGGGTCCGCCCCTGCCGCATCTTCTTCCGCGTCTGCCTCAAACATGCCCAAGCCGTGGTGTCCCCGGAGCCCCCTTGCACCTTCGGGGCAGCCCTTAGCGATATCGTCCCTGCGGACCGCAACACAGTGGCCACCAGCACACCCATCCGGGTCCCCTTCCATTTCAAGTGGCCGGGGACATTTTCCCTCATTATTGAATCCTGGAGGGCTGAGTCAGGGGAGCCATCAACAGAGGATGCCCAGAGGCTGATCAGCCGCTTGGCCACCCGCCGCCGCCTGGCCGTCGGTGAAGACTGGTCGCAAGATGTGCAACTGGGAGACCAGAGCGAGCTGCGCTACTCCTACCATGTCACCTGCGACGAGCACTACTATGGGGAGAGCTGCTCGGACTATTGCCGGCCGCGGGACGATACCTTTGGGCACTACAGCTGTGACGAACTGGGCAGCCGGATCTGCTTAGCAGGGTGGCGGGGCGAATATTGCTCCGAGCCTGTTTGTTTGCCCGGCTGCAGCCACAGCCACGGGTTCTGCGAGAAGCCCGGTGAGTGCAAGTGCCGCATCGGCTGGCAGGGCCCCCTCTGCGATGCCTGCGTCCGCTACCCGGGCTGCCTCCACGGGACCTGCGCCCAGCCCTGGCAGTGCAACTGTCGGGAAGGCTGGGGCGGGCTCTTCTGCAACCAGGACCTCAACTATTGCACCAACCACCGTCCCTGCAAGAACGGGGCCACCTGCACCAACACGGGCCAAGGGAGCTACACCTGCGGCTGCCGGGCTGGCTTTGCGGGCACCAGCTGCGAGATGGAGATCAATGAGTGCGACAGCAACCCCTGCAAGAACGGAGGCAGCTGCAACGACCTGGAGAATGACTACAAATGCACCTGTCCTCAAGGCTTCTACGGCAAGAATTGTGAAATCAGTGCCATGACCTGCGCTGACGGACCGTGTTTCAATGGCGGGACTTGCATTGAGAAGCACTTGGGTGGCTACAGTTGTCACTGCCCAGTCAACTACCATGGCTCCAATTGCGAGAAGAAGATAGACCGATGTAGTAACAACCCTTGCTTGAACAACGGCCACTGTCTGGATCTGGGCCGCAGCATGATCTGCAAATGCCGCCCGGGCTTCGTTGGCTCCTTCTGTGAGCTGAACATCGACGACTGCGCGGGCAACCCATGTGCCAATGGAGGCACCTGCATTGATGGTCCAAACAGCTACACCTGTTCTTGCACATTGGGCTACGGTGGGAAGGACTGCAGCACCCGCATGGATGCCTGTGGCTCCAGCCCCTGCTTGAACAGCGGCACTTGCTATACCCACTTCTCCGGCCACGTCTGCGAGTGTTCGGCAGGCTACATGGGTTCCAACTGTGAATTCAAAGTTCAGATCCCAACCCCTGTTAGCAGCCAACGGGTGGCCGAAAGCCCTTTCCCTGTTGCACTAGCTGTTTCCTTTACTCTGGGCCTCATGATGTTGGTGCTTGCCGCCTGTGCCACCGCAGCAATGCTTCGGCACATGAGG');

$('#tail-dna').html('<div class="first">' + tail.alleles[0].dna_seq + '</div><div class="hidden">' + tail.alleles[1].dna_seq + '</div><div class="hidden">' + tail.alleles[2].dna_seq + '</div>');

// metallic
var metallic = new Gene('metallic', '120');
metallic.addAllele('mettalic', 'ATGACAGTGGGATTTTTTCACGCAACAATGAAAAGGAAGAACCTTTTCCTAAGCCTATTGCTCTGCTACAGTTTGCTCAGAGCTGCCAGTTCTCACCTCATAATCGAGGAGAAGACAGAATGCAACCTTTCAAAGAGCAACAAAATGAACCTCCCAGATCTCCCACCCATCTCCATTGTAGATTTAACTAAAAGATCCCAGAAAGTCAGCAGAAAAGAGGCAGAGAATAAGAAATCTTCCAAGAAAAATGCTGAACTGAAGGCACCTCCAAAACCAAGGCCCACACCTGCTGCTGACTGCGTGCCAAACTTCAAAACCTGCAAACCACACTTGAATCCATGTTGTAACTACTGTGCGTTGTGCAAATGCCGAATTTTTCAGACTATCTGCCAATGTCTACTGTTAAACCCAAAGTGTTAA');
metallic.addAllele('non-mettalic', 'ATGACAGTGGGATTTTTTCTCGCAACAATGAAAAGGAAGAACCTTTTCCTAAGCCTATTGCTCTGCTACAGTTTGCTCAGAGCTGCCAGTTCTCACCTCATAATCGAGGAGAAGACAGAATGCAACCTTTCAAAGAGCAACAAAATGAACCTCCCAGATCTCCCACCCATCTCCATTGTAGATTTAACTAAAAGATCCCAGAAAGTCAGCAGAAAAGAGGCAGAGAATAAGAAATCTTCCAAGAAAAATGCTGAACTGAAGGCACCTCCAAAACCAAGGCCCACACCTGCTGCTGACTGCGTGCCAAACTTCAAAACCTGCAAACCACACTTGAATCCATGTTGTAACTACTGTGCGTTGTGCAAATGCCGAATTTTTCAGACTATCTGCCAATGTCTACTGTTAAACCCAAAGTGTTAA');

$('#metallic-dna').html('<div class="first">' + metallic.alleles[0].dna_seq + '</div><div class="hidden">' + metallic.alleles[1].dna_seq + '</div>');

// wings
var wings = new Gene('wings', '420');
wings.addAllele('wings', 'ATGATGGCTTGGAGGGGCTGCTGCCGGCTGGGGCTTCGCTGGAGGCATGGCTGGAGAGAGGCAGGCGGGCGCAGAGGGATTGCCTCCTGCATTGACCCCTCCATGGGTCTGACCGAAGAACAGAAGGAGTTCCAAAAAGTGGCCTTTGATTTTGCTGCCAAAGAAATGGCCCCACACATGGCGGAGTGGGATGAAAAGGAGATTTTCCCTGTGGAAACCATACGGAGAGCGGCTCAGCTGGGGTTCGGGGGCATCTACGTGAGGCCAGACGTGGGGGGATCTGGACTGTCCCGCCTCGATACCTCCATCATCTTCGAGGCTCTTTCAACCGGCTGTGTCAGCACAACTGCCTATCTCAGCATCCACAATATGTGCGCTTGGATGGTCGACGTCTTCGGGAAGGAGGAGCAGCGGCAGAGGTTTTGCCCCTCACTTTGCAGCATGGAAAAACTGGCCTCTTACTGCCTGACAGAACCAGGCAGTGGCAGTGATGCTGCGTCTTTGCTAACATCGGCCAAGAGGGACGGAGACAATTACATCTTAAATGGTTCCAAGGCTTTCATCAGTGGCGGCGGAGACACCGATCTCTATGTGGTGATGTGCCGAACAGGAGGCCCGGGCCCTAAGGGCATCTCCTGCCTGGTGCTGGAGAAAGGGACCCCTGGATTGAGCTTTGGAAAAAAGGAGAGGAAGGTGGGCTGGAACTCACAGCCGACCCGAGCTGTGGTATTTGAGGACTGTGCTGTCCCAGTAGCCAACCGCCTTGGCGAAGAAGGCCAGGGCTTCAACATCGCAATGAAGGGCTTGAATGGAGGCCGAATTAACATTGCTTCTTGTTCTTTGGGGGCTGCCCATGCTTCGATCCTGCTGGCCCGGGATCACCTTAAGGTCCGTAAACAGTTTGGAGACCTGCTGGCCAACTATCAGTACCTCCAGTTCCAGCTAGCCGAGATGGCCACCCGCTTAGTGGCGGCTCGGCTGATGGTACGCAATGCAGCCAGGGCCCTGCAAGAGGAGCGGGAGGACGCTGTGGCCTTGTGCTCTATGGCCAAGCTGTTTGCCACGGATGAATGCTTTGCGGTATAA');
wings.addAllele('no wings', 'ATGATGGCTTGGAGGGGCTGCTGCCGGCTGGGGCTTCGCTAGAGGCATGGCTGGAGAGAGGCAGGCGGGCGCAGAGGGATTGCCTCCTGCATTGACCCCTCCATGGGTCTGACCGAAGAACAGAAGGAGTTCCAAAAAGTGGCCTTTGATTTTGCTGCCAAAGAAATGGCCCCACACATGGCGGAGTGGGATGAAAAGGAGATTTTCCCTGTGGAAACCATACGGAGAGCGGCTCAGCTGGGGTTCGGGGGCATCTACGTGAGGCCAGACGTGGGGGGATCTGGACTGTCCCGCCTCGATACCTCCATCATCTTCGAGGCTCTTTCAACCGGCTGTGTCAGCACAACTGCCTATCTCAGCATCCACAATATGTGCGCTTGGATGGTCGACGTCTTCGGGAAGGAGGAGCAGCGGCAGAGGTTTTGCCCCTCACTTTGCAGCATGGAAAAACTGGCCTCTTACTGCCTGACAGAACCAGGCAGTGGCAGTGATGCTGCGTCTTTGCTAACATCGGCCAAGAGGGACGGAGACAATTACATCTTAAATGGTTCCAAGGCTTTCATCAGTGGCGGCGGAGACACCGATCTCTATGTGGTGATGTGCCGAACAGGAGGCCCGGGCCCTAAGGGCATCTCCTGCCTGGTGCTGGAGAAAGGGACCCCTGGATTGAGCTTTGGAAAAAAGGAGAGGAAGGTGGGCTGGAACTCACAGCCGACCCGAGCTGTGGTATTTGAGGACTGTGCTGTCCCAGTAGCCAACCGCCTTGGCGAAGAAGGCCAGGGCTTCAACATCGCAATGAAGGGCTTGAATGGAGGCCGAATTAACATTGCTTCTTGTTCTTTGGGGGCTGCCCATGCTTCGATCCTGCTGGCCCGGGATCACCTTAAGGTCCGTAAACAGTTTGGAGACCTGCTGGCCAACTATCAGTACCTCCAGTTCCAGCTAGCCGAGATGGCCACCCGCTTAGTGGCGGCTCGGCTGATGGTACGCAATGCAGCCAGGGCCCTGCAAGAGGAGCGGGAGGACGCTGTGGCCTTGTGCTCTATGGCCAAGCTGTTTGCCACGGATGAATGCTTTGCGGTATAA');

$('#wings-dna').html('<div class="first">' + wings.alleles[0].dna_seq + '</div><div class="hidden">' + wings.alleles[1].dna_seq + '</div>');

// horns
var horns = new Gene('horns', '510');
horns.addAllele('horns', 'ATGGACAGTCAAATGGAGACATCCTGCAAACAAACCATCATCTATGTAGACAGGAGTGAACTGGACACTACAGAATGCTTTCTCAAAGCAGCATATTCTCCACTGTTAAGCCTCCTTCATAAAATTAAATTTAAGGACAATTCTGCAAACTTCAATAAGCTAGAAAGAATTAAAGACCTGCACTTGCAACTTGGAATTTGCATTGATGACTATCCTGATCACCAGACATGCACCAAGAAGTTCTCCCTGACTCCGGAGAAGATGTTGCAAATGGTGCACGACTATTTCAGCGAAGCTAAGCATTTCTTGTTCAAATCAGGCTTCACTCAGGATTGTTCTAGTGCCTTCAAGAAGTGTTCAGACTCTCAGAACACAGACAAGCACATTAAGAGGCCAGAACCCAGCGATACCCGAGGGATGGCTGTGACTTATGTGACGGTGGCCAGTGTCCTGGGGATTCTGCTGGCAGTGGGAGGCTTGCTGTTCTACTTGCATAAATCCAGGACCTTAACGAGGAGGCAACCACAGAGGAATGACAACAACGTTGAAAGACCAGAAGAAGGAAGGCCACTGAATAGAGGGGAGGAACATATAGAACTGCAGATC');
horns.addAllele('no horns', 'ATGGACAGTCAAATGGAGACATCCTGCGAACAAACCATCATCTATGTAGACAGGAGTGAACTGGACACTACAGAATGCTTTCTCAAAGCAGCATATTCTCCACTGTTAAGCCTCCTTCATAAAATTAAATTTAAGGACAATTCTGCAAACTTCAATAAGCTAGAAAGAATTAAAGACCTGCACTTGCAACTTGGAATTTGCATTGATGACTATCCTGATCACCAGACATGCACCAAGAAGTTCTCCCTGACTCCGGAGAAGATGTTGCAAATGGTGCACGACTATTTCAGCGAAGCTAAGCATTTCTTGTTCAAATCAGGCTTCACTCAGGATTGTTCTAGTGCCTTCAAGAAGTGTTCAGACTCTCAGAACACAGACAAGCACATTAAGAGGCCAGAACCCAGCGATACCCGAGGGATGGCTGTGACTTATGTGACGGTGGCCAGTGTCCTGGGGATTCTGCTGGCAGTGGGAGGCTTGCTGTTCTACTTGCATAAATCCAGGACCTTAACGAGGAGGCAACCACAGAGGAATGACAACAACGTTGAAAGACCAGAAGAAGGAAGGCCACTGAATAGAGGGGAGGAACATATAGAACTGCAGATC');

$('#horns-dna').html('<div class="first">' + horns.alleles[0].dna_seq + '</div><div class="hidden">' + horns.alleles[1].dna_seq + '</div>');

// color
var color = new Gene('color', '90');
color.addAllele('color', 'ATGTGTCTTTTCTCCATCGGCATCTTCTTCGGTCTTCTTCCTCTAGGATTGAGCCAGTTCCCACGGGCATGTGCCAATTCGGACAGTCTGCTAAAAAAGGAATGCTGCCCCCCTTGGCCAGGGGACGGGTCTCCTTGTGGAGAGCTTTCAGGCAGGGGGTCCTGTTCAGATATCCTTCTTTCAGATGCCCCACTTGGTCCTCAGTTTCCCTTCTCTGGAGTGGACGACAGGGAAGATTGGCCAGCTGTTTTTTATAACAGAACTTGCCAATGCACAGGCAACTTCATGGGGTTCAACTGCGGCGATTGCAAGTTCAACTTTGCAGGTCCCAACTGCACTCAAAGAAAGGCACAGGTGAGGAGAGATATCTTCCGGATCAGTGCCAGGGAAAAGTTCCAGTTTCTTGCCTACCTCAATTTGGCCAAGCACACAACTAGCCGGGATTTTGTCATTGCAACAGGAACGTATGCTCAAATGAACAACGGCTCAACCCCTATGTTCCGAGACATCAACGTCTATGACCTGTTCGTTTGGATGCATTATTACGTGTCCCGGGATACGCTCCTTGGAGGCACCAGCGTGTGGCGAGACATTGATTTTGCCCATGAGGCCCCAGGTTTCCTTCCTTGGCACCGGCTTTTTTTGCTCATGTGGGAACATGAGATCCAGAAGTTGACTGGGAATGAGAACTTTACCATCCCCTATTGGGACTGGCGAGATGCCCAGGGCTGTGACATCTGTACGGATGAAATCATGGGTGGCAGACATCCCAGCAACCCAAACATTCTGAGTCCAGCTTCTTTCTTCTCTTCATGGCAGGTAATTTGCAGCCGGTCAGAAGAGTACAACAGTCGTCAAGAACTTTGCAATGGCACAAATGAAGGGCCTATTCTTCGAAACCCCGGCAACCATGATAAAGGGAGGACACCTCGGCTTCCATCTTCGGCAGATGTTGAATTCTGCTTAAGTTTGACACAGTACGAAGCGGGAACCATGGACAAAATGGCTAACTTCAGCTTCAGGAATACTTTGGAAGGCTTTGCTGATCCGAGTACTGCAATATCAAATGTATCTCAAAGCAGCCTGCACAACGCATTGCACATCTACATGAATGGCTCCATGTCTGAGGTACAAGGATCAGCCAATGATCCCATCTTCATCCTTCACCATGCCTTTGTTGACAGCATTTTTGAACAATGGCTTAGAAGACATCGACCTCTACGTGAGGTTTATCCTGCAGCCAATGCCCCAATTGGACACAACCGTGAATCCTACATGGTCCCCTTCATTCCACTTTACAGGAATGGGGAATTCTTCATATCATCAATAGAACTGGGATATGACTATGAATATCTAACAAATCCAGCCAACCCCTTCCAGAATTTTTTCCTGCCTTATTTGGAACAGGCACGTCAAATCTGGCCATGGCTGGTGGGAGCTGCCGTGGTGGGTGCCATTATAATGTTGATTGTTGGCATCATTGTTCTACGATGTCGGAAGAAGAGACGGATCTCAGAAGAGACACAACCATTACTCATGGAGAGTGAGGATTATCAGCACATGACATACCAGTCACATGTATAA');
color.addAllele('no-color', 'ATG__TCTTTTCTCCATCGGCATCTTCTTCGGTCTTCTTCCTCTAGGATTGAGCCAGTTCCCACGGGCATGTGCCAATTCGGACAGTCTGCTAAAAAAGGAATGCTGCCCCCCTTGGCCAGGGGACGGGTCTCCTTGTGGAGAGCTTTCAGGCAGGGGGTCCTGTTCAGATATCCTTCTTTCAGATGCCCCACTTGGTCCTCAGTTTCCCTTCTCTGGAGTGGACGACAGGGAAGATTGGCCAGCTGTTTTTTATAACAGAACTTGCCAATGCACAGGCAACTTCATGGGGTTCAACTGCGGCGATTGCAAGTTCAACTTTGCAGGTCCCAACTGCACTCAAAGAAAGGCACAGGTGAGGAGAGATATCTTCCGGATCAGTGCCAGGGAAAAGTTCCAGTTTCTTGCCTACCTCAATTTGGCCAAGCACACAACTAGCCGGGATTTTGTCATTGCAACAGGAACGTATGCTCAAATGAACAACGGCTCAACCCCTATGTTCCGAGACATCAACGTCTATGACCTGTTCGTTTGGATGCATTATTACGTGTCCCGGGATACGCTCCTTGGAGGCACCAGCGTGTGGCGAGACATTGATTTTGCCCATGAGGCCCCAGGTTTCCTTCCTTGGCACCGGCTTTTTTTGCTCATGTGGGAACATGAGATCCAGAAGTTGACTGGGAATGAGAACTTTACCATCCCCTATTGGGACTGGCGAGATGCCCAGGGCTGTGACATCTGTACGGATGAAATCATGGGTGGCAGACATCCCAGCAACCCAAACATTCTGAGTCCAGCTTCTTTCTTCTCTTCATGGCAGGTAATTTGCAGCCGGTCAGAAGAGTACAACAGTCGTCAAGAACTTTGCAATGGCACAAATGAAGGGCCTATTCTTCGAAACCCCGGCAACCATGATAAAGGGAGGACACCTCGGCTTCCATCTTCGGCAGATGTTGAATTCTGCTTAAGTTTGACACAGTACGAAGCGGGAACCATGGACAAAATGGCTAACTTCAGCTTCAGGAATACTTTGGAAGGCTTTGCTGATCCGAGTACTGCAATATCAAATGTATCTCAAAGCAGCCTGCACAACGCATTGCACATCTACATGAATGGCTCCATGTCTGAGGTACAAGGATCAGCCAATGATCCCATCTTCATCCTTCACCATGCCTTTGTTGACAGCATTTTTGAACAATGGCTTAGAAGACATCGACCTCTACGTGAGGTTTATCCTGCAGCCAATGCCCCAATTGGACACAACCGTGAATCCTACATGGTCCCCTTCATTCCACTTTACAGGAATGGGGAATTCTTCATATCATCAATAGAACTGGGATATGACTATGAATATCTAACAAATCCAGCCAACCCCTTCCAGAATTTTTTCCTGCCTTATTTGGAACAGGCACGTCAAATCTGGCCATGGCTGGTGGGAGCTGCCGTGGTGGGTGCCATTATAATGTTGATTGTTGGCATCATTGTTCTACGATGTCGGAAGAAGAGACGGATCTCAGAAGAGACACAACCATTACTCATGGAGAGTGAGGATTATCAGCACATGACATACCAGTCACATGTATAA');

$('#color-dna').html('<div class="first">' + color.alleles[0].dna_seq + '</div><div class="hidden">' + color.alleles[1].dna_seq + '</div>');

// black/brown
var black = new Gene('black', '150');
black.addAllele('brown', 'ATGCAGAGTGTTATTATGCACCTATCCATATTACTACTCCTCACCTTTTTTCAAGAAATTCATGCTCAGTTCCCCCGGCAGTGTGCTACAGTTGCGGCTCTGACAAGCGGTGAATGTTGCCCAGATCTGTCTCCCGTGGTGATACCCGGTTCAGACCGTTGTGGATCATCTATTGGAAGGGGTCAATGTGTCCAAGTGATGGCAGACAGTCGGCCCCATGGACCACAGTACATGCATGATGGTCAAGATGACCGAGAGCAGTGGCCTCTGCGCTTTTTCAATCGAACCTGTCAATGCAACAGAAATTTTTCAGGATATAATTGTGGGTCCTGCCGTCCTGGTTGGAGTGGACCTGCATGTGATCAGCAGACTCAGACAGTCAGACGAAACATTCTGGATCTGAGTAACGAGGAAAGGAATCAATTCCTAAGAGTCCTTCATCAAGCCAAAAACACAGTGCATCCCAACATTGTGATTGCTATCCGGAGGCGGGAAGAGATACTGGGTCCTGATGGCAACACACCACAATTCGAAAATGTGACAATTTATAATTACTTTGTGTGGTCCCATTACTACTCTGTCAGAAAGACATTCCTTGGCCCAGGGCTGCCCAGTTTTGGGGGAATAGATTTCTCCCATGAAGGGCCAGCATTTCTCACCTGGCATAGATACCACCTCCTACAGCTGGAAAAAGATATCCAGGATATGATCCGGGATCCTTCTTTTGCACTTCCCTACTGGAACTTTGCAACAGGTAGAAACACTTGTGACATCTGTACAGATGAACTCATGGGAGCTAGAAGCAACTTTGATACCAATCTTCTAAGCCAAAACTCTGTCTTCTCTCAGTGGCGTGTTTTGTGTGAAAATGTTGATGACTATGACACCTTGGGAACCATATGCAACAGCTCAGAAGGGGGTCCAATTAGACGAAACCCAGCTGGAAATGTTGCTCGGCCAATGGTGCAGCGCCTTCCTGAGCCACAGGATGTAGCTCTTTGCTTAGAAGTCGGATTGTTTGATACACCGCCATTCTATTCAAATTCAACAGACAGTTTTCGCAATTCGCTGGAAGGCTACAGCCAACCTTCTGGAAAGTATGATCCCATAGTACGCAGTCTTCACAACCTGGCCCATCTGTTTTTGAATGGCACGGGAGGGCAAACCCATCTCTCGCCAAATGATCCTATCTTTGTTCTCCTTCATACCTTTACTGATGCACTTTTTGATGAATGGCTGAGGAGGCACAATACCGATATTTCAATATTTCCTCTGGAGAATGCCCCCATTGGACACAACAGACAGTACAACATGGTGCCATTCTGGCCTCCAGTGACCAACAATGAGATGTTTGTTTCAGCACCAGAAAATCTGGGCTACAGTTATGAAGTTCAATGGCCAACTCGGGCCCTCCACATCACTGAGATCATAACTATCGCAATTGTGACAGCCTTGATCCTGGTTGCAATTATATTTGCCGGTGCCACATGCATAGTTCACGCCAGACGGAGGGACGATGAAATTCACCAGCCTCTTCTCAATGAACAATATCAGACCTACTCAGACGATTACGACAGTATACCCACCCCAAGCCAGTCAGTTGTGTGA');
black.addAllele('black', 'ATGCAGAGTGTTATTATGCACCTATCCATATTACTACGCCTCACCTTTTTTCAAGAAATTCATGCTCAGTTCCCCCGGCAGTGTGCTACAGTTGCGGCTCTGACAAGCGGTGAATGTTGCCCAGATCTGTCTCCCGTGGTGATACCCGGTTCAGACCGTTGTGGATCATCTATTGGAAGGGGTCAATGTGTCCAAGTGATGGCAGACAGTCGGCCCCATGGACCACAGTACATGCATGATGGTCAAGATGACCGAGAGCAGTGGCCTCTGCGCTTTTTCAATCGAACCTGTCAATGCAACAGAAATTTTTCAGGATATAATTGTGGGTCCTGCCGTCCTGGTTGGAGTGGACCTGCATGTGATCAGCAGACTCAGACAGTCAGACGAAACATTCTGGATCTGAGTAACGAGGAAAGGAATCAATTCCTAAGAGTCCTTCATCAAGCCAAAAACACAGTGCATCCCAACATTGTGATTGCTATCCGGAGGCGGGAAGAGATACTGGGTCCTGATGGCAACACACCACAATTCGAAAATGTGACAATTTATAATTACTTTGTGTGGTCCCATTACTACTCTGTCAGAAAGACATTCCTTGGCCCAGGGCTGCCCAGTTTTGGGGGAATAGATTTCTCCCATGAAGGGCCAGCATTTCTCACCTGGCATAGATACCACCTCCTACAGCTGGAAAAAGATATCCAGGATATGATCCGGGATCCTTCTTTTGCACTTCCCTACTGGAACTTTGCAACAGGTAGAAACACTTGTGACATCTGTACAGATGAACTCATGGGAGCTAGAAGCAACTTTGATACCAATCTTCTAAGCCAAAACTCTGTCTTCTCTCAGTGGCGTGTTTTGTGTGAAAATGTTGATGACTATGACACCTTGGGAACCATATGCAACAGCTCAGAAGGGGGTCCAATTAGACGAAACCCAGCTGGAAATGTTGCTCGGCCAATGGTGCAGCGCCTTCCTGAGCCACAGGATGTAGCTCTTTGCTTAGAAGTCGGATTGTTTGATACACCGCCATTCTATTCAAATTCAACAGACAGTTTTCGCAATTCGCTGGAAGGCTACAGCCAACCTTCTGGAAAGTATGATCCCATAGTACGCAGTCTTCACAACCTGGCCCATCTGTTTTTGAATGGCACGGGAGGGCAAACCCATCTCTCGCCAAATGATCCTATCTTTGTTCTCCTTCATACCTTTACTGATGCACTTTTTGATGAATGGCTGAGGAGGCACAATACCGATATTTCAATATTTCCTCTGGAGAATGCCCCCATTGGACACAACAGACAGTACAACATGGTGCCATTCTGGCCTCCAGTGACCAACAATGAGATGTTTGTTTCAGCACCAGAAAATCTGGGCTACAGTTATGAAGTTCAATGGCCAACTCGGGCCCTCCACATCACTGAGATCATAACTATCGCAATTGTGACAGCCTTGATCCTGGTTGCAATTATATTTGCCGGTGCCACATGCATAGTTCACGCCAGACGGAGGGACGATGAAATTCACCAGCCTCTTCTCAATGAACAATATCAGACCTACTCAGACGATTACGACAGTATACCCACCCCAAGCCAGTCAGTTGTGTGA');

$('#black-dna').html('<div class="first">' + black.alleles[0].dna_seq + '</div><div class="hidden">' + black.alleles[1].dna_seq + '</div>');

//forelimbs
var forelimbs = new Gene('forelimbs', '480');
forelimbs.addAllele('forelimbs', 'ATGTGCAAATGGAAAGTGACTAAGGGTGCCTCAGCCTGGTTCCGTCTGTCCTGCCTTTCCCTGCCGCTGCTGCTTCTGTTCCTGTGTTCGGCTCTGCCTGTGGCCTGCCATGACACCCACAGGGCCATCCGTGCCCCGAGGGGCACCAACTCCTCATCGTCTGCCGTGGTGGGGCGGCATGTGCGCAGCTACAACCACCTCACGGGGGACGTGCGCAGGAGGAAACTCTTCTCCTACCAGAAGTTCTTTCTCAGGATCGATAAGAACGGAAAAGTCAATGGCACCAAAAGCAAGGACGATCCGTACAGTACACTCGAAATCAAGTCTGTGGATGTGGGCATCGTTGCCATCAAGGGGATTCAAAGCAATTACTACCTTGCAATTAACAAGAAAGGGGTGGTCTACGGGGCGAGGGATTTCGGCATTGACTGCAAGCTGATAGAGAGGATAGAGGAGAACAGGTACAACACCTATGCCTCGGCAGAATGGATGAACAAGAAGAAGCACATGTTCGTAGGTCTGAGCGCCAACGGGAGGCCGATGAGGGCCAAAAAGACCCGGAGAAAAAACACAGCCACACACTTTCTCCCCATTCCTATCGTGTAG');
forelimbs.addAllele('no-forelimbs', 'ATGTGCAAATGGAAAGTGACTAAGGGTGCCTCAGCCTGGTTCCGTCTGTCCTGCCTTTCCCTGCCGCTGCAGCTTCTGTTCCTGTGTTCGGCTCTGCCTGTGGCCTGCCATGACACCCACAGGGCCATCCGTGCCCCGAGGGGCACCAACTCCTCATCGTCTGCCGTGGTGGGGCGGCATGTGCGCAGCTACAACCACCTCACGGGGGACGTGCGCAGGAGGAAACTCTTCTCCTACCAGAAGTTCTTTCTCAGGATCGATAAGAACGGAAAAGTCAATGGCACCAAAAGCAAGGACGATCCGTACAGTACACTCGAAATCAAGTCTGTGGATGTGGGCATCGTTGCCATCAAGGGGATTCAAAGCAATTACTACCTTGCAATTAACAAGAAAGGGGTGGTCTACGGGGCGAGGGATTTCGGCATTGACTGCAAGCTGATAGAGAGGATAGAGGAGAACAGGTACAACACCTATGCCTCGGCAGAATGGATGAACAAGAAGAAGCACATGTTCGTAGGTCTGAGCGCCAACGGGAGGCCGATGAGGGCCAAAAAGACCCGGAGAAAAAACACAGCCACACACTTTCTCCCCATTCCTATCGTGTAG');

$('#forelimbs-dna').html('<div class="first">' + forelimbs.alleles[0].dna_seq + '</div><div class="hidden">' + forelimbs.alleles[1].dna_seq + '</div>');

// hindlimbs
var hindlimbs = new Gene('hindlimbs', '510');
hindlimbs.addAllele('hindlimbs', 'ATGAACTCTATGAGGGATCCATTAAACATAGACCATCACCACGTAACCGGGAATAAACTCGCATCCGCGCACCCCACGGCTCTGGCGATGGCCTCCACTCTGCAGCCGCTGCAGCGGTCCGTGGACTCTAAGCACCGGTTAGAGGTGCACACGGTGTCGGACACGTCCAGTCCGGAGTCTGTCGAAAAAGAAAAGAACCTGAATAAGAACGACGACTCCTCGGATGACCCTTCAAAAAAGAAGCGGCAGCGGCGGCAGAGGACTCACTTTACCAGCCAGCAGCTGCAGGAGCTGGAGGCCACCTTCCAGCGGAATCGCTACCCGGACATGAGCACGAGGGAGGAGATAGCCGTGTGGACCAACCTCACGGAGGCCCGGGTCAGGGTTTGGTTCAAGAACCGACGAGCCAAGTGGAGGAAACGCGAGAGGAACCAACAAGCCGAGTTGTGCAAGAACGGCTTCGGCCCGCAGTTCAACGGACTCATGCAGCCCTACGAAGACATGTACCCGAGCTACACGTACAACAACTGGGCCGCCAAGGGCCTGACGTCGGCCTCTCTGTCCACCAAAAGCTTCCCTTTCTTCAACTCCATGAACGTCAACCCGCTGTCCTCGCAGACCATGTTCTCGCCGTCCAACTCCATATCCTCCATGACGTCCAGCATGGTGCCGTCGGCGGTCACTGGCGTGCCGGGCTCCAGCCTCAACAGCCTCAATAACTTGAACAACCTCAGTAACCCGTCTCTCAACTCGGGGGTGCCCACCTCGGCGTGTCCCTACGCGCCCCCGACCCCGCCCTACGTGTACAGGGACACTTGCAACTCCAGCCTGGCCAGCCTGAGACTGAAAGCCAAGCAGCACTCGAGTTTTGGATACGCCAGTGTGCAGAATCCGGCCACTAACCTGAGCGCTTGCCAGTACGCCGTGGACAGACCCGTCTAA');
hindlimbs.addAllele('no-hindlimbs', 'ATGAACTCTATGAGGGATCCATTAAACATAGACCATCACCACGTAACCGGGAAAAAACTCGCATCCGCGCACCCCACGGCTCTGGCGATGGCCTCCACTCTGCAGCCGCTGCAGCGGTCCGTGGACTCTAAGCACCGGTTAGAGGTGCACACGGTGTCGGACACGTCCAGTCCGGAGTCTGTCGAAAAAGAAAAGAACCTGAATAAGAACGACGACTCCTCGGATGACCCTTCAAAAAAGAAGCGGCAGCGGCGGCAGAGGACTCACTTTACCAGCCAGCAGCTGCAGGAGCTGGAGGCCACCTTCCAGCGGAATCGCTACCCGGACATGAGCACGAGGGAGGAGATAGCCGTGTGGACCAACCTCACGGAGGCCCGGGTCAGGGTTTGGTTCAAGAACCGACGAGCCAAGTGGAGGAAACGCGAGAGGAACCAACAAGCCGAGTTGTGCAAGAACGGCTTCGGCCCGCAGTTCAACGGACTCATGCAGCCCTACGAAGACATGTACCCGAGCTACACGTACAACAACTGGGCCGCCAAGGGCCTGACGTCGGCCTCTCTGTCCACCAAAAGCTTCCCTTTCTTCAACTCCATGAACGTCAACCCGCTGTCCTCGCAGACCATGTTCTCGCCGTCCAACTCCATATCCTCCATGACGTCCAGCATGGTGCCGTCGGCGGTCACTGGCGTGCCGGGCTCCAGCCTCAACAGCCTCAATAACTTGAACAACCTCAGTAACCCGTCTCTCAACTCGGGGGTGCCCACCTCGGCGTGTCCCTACGCGCCCCCGACCCCGCCCTACGTGTACAGGGACACTTGCAACTCCAGCCTGGCCAGCCTGAGACTGAAAGCCAAGCAGCACTCGAGTTTTGGATACGCCAGTGTGCAGAATCCGGCCACTAACCTGAGCGCTTGCCAGTACGCCGTGGACAGACCCGTCTAA');

$('#hindlimbs-dna').html('<div class="first">' + hindlimbs.alleles[0].dna_seq + '</div><div class="hidden">' + hindlimbs.alleles[1].dna_seq + '</div>');

// armor
var armor = new Gene('armor', '540');
armor.addAllele('full-armor', 'ATGGTGTGTCTGGGAGAATGCCGATGGCTTCACATGTTTCCATTCCTCATGGTATCACTTGTATATTCTGCTAATGCTGAATATTCTAACTGTGGTAAAAATGAGTACTACAACCAGACGACCGGGATGTGCCATGAGTGTCCACAATGTGAGCCAGGAGAAGAACCATACATGACATGTGGATATGGGACTAAAGATGAAGACTACGGCTGTGTTCCTTGTCCATCGGAAAAGTTTTCTAAAGGAGGTTATCAGATATGCAGGAGGCACAAGGATTGCGAGGGCTTCTTCCGGGCAACTGTTATGACACCTGGAGATCAAGAGAATGATGCAGAATGTGGGCCTTGTCTCCCCGGTTACTACATGTTAGAAAACCGGCCCCGGAATATCTATGGGATGGTTTGCTACTCATGCTCGCTGGCACCTCCAAACACCAAAGAATGTGCAGGTATTACTTCTGGTGCATCAGTCAGTTTCTCAAGTACTTCTGGAACAAGTACTCAATCTCCTTTCCGGCATATACACAAAGCAGATCTGACTGGACAAGGCCATCTTGCTACAGCTCTCATAATTGCTATGTCAACTATATTCATCATGGCTATTGCTATCGTCCTGATCATCATGTTCTACATTGTCAAAACAAAAACATCAGCACAAGCATGCTGCACCAGCCATCCTGTGAAGACTGTGGAAGCCCCAGCCATTATGCAGGAAGAAAAGAAAGAAGTACAAGAAAATGTAGTTATTTTCTCAGAGAAAGATGAGTTTGGAAAATTAACAGCAACTCCTGCAAAAGTGGTCAAGAGTGAAAATGATGCTTCCTCGGAGAATGAGAGACTTTTAAGTCGGAGCATGGACAGTGATGAAGAAGCTGCAATTGACAAACAAGGAACACCAGATCTGTGCTTGTTATCTCTAGTCCATCTGGCTCGAGATAAATCTTCTACAAACAACAAATCTACTGGTATACAAAGCCGGAGGAAAAAGATTCTTGATCTGTATGCTAATGTATGCAGTGTTGCAGAAGGTCTCAGTCCCACAGAGCTGCCTTTTGATTGTCTGGAGAAGACCAGCAGGATGCTCAGCTCTACATACAACACTGAAAAAGCTATTGTGAAGACTTGGCGTCACCTTGCTGAAAGCTTTGGACTGAAGCGTGATGAAATTGGGGGCATGACAGATGGCATGCAGCTCTTTGATCGCATCAGCACAGCAGGCTACAGTATCCCAGAACTCTTAACAAAACTAGTGCAAATTGAGCGGTTGGATGCTGTGGAGTCTCTCTGCGCAGATATTTTGGAGTGGGCACAAGTGATGCCCAAACCTGAACCAGTGGTGGCTTCGTGA');
armor.addAllele('some-armor', 'ATGGTGTGTCTGGGAGAATGCCGATGGCTTCACATGTTTCCATTCCTCATGGTATCACTTGTATATTCTGCTAATGCTGAATATTCTAACTGTGGTGTAAATGAGTACTACAACCAGACGACCGGGATGTGCCATGAGTGTCCACAATGTGAGCCAGGAGAAGAACCATACATGACATGTGGATATGGGACTAAAGATGAAGACTACGGCTGTGTTCCTTGTCCATCGGAAAAGTTTTCTAAAGGAGGTTATCAGATATGCAGGAGGCACAAGGATTGCGAGGGCTTCTTCCGGGCAACTGTTATGACACCTGGAGATCAAGAGAATGATGCAGAATGTGGGCCTTGTCTCCCCGGTTACTACATGTTAGAAAACCGGCCCCGGAATATCTATGGGATGGTTTGCTACTCATGCTCGCTGGCACCTCCAAACACCAAAGAATGTGCAGGTATTACTTCTGGTGCATCAGTCAGTTTCTCAAGTACTTCTGGAACAAGTACTCAATCTCCTTTCCGGCATATACACAAAGCAGATCTGACTGGACAAGGCCATCTTGCTACAGCTCTCATAATTGCTATGTCAACTATATTCATCATGGCTATTGCTATCGTCCTGATCATCATGTTCTACATTGTCAAAACAAAAACATCAGCACAAGCATGCTGCACCAGCCATCCTGTGAAGACTGTGGAAGCCCCAGCCATTATGCAGGAAGAAAAGAAAGAAGTACAAGAAAATGTAGTTATTTTCTCAGAGAAAGATGAGTTTGGAAAATTAACAGCAACTCCTGCAAAAGTGGTCAAGAGTGAAAATGATGCTTCCTCGGAGAATGAGAGACTTTTAAGTCGGAGCATGGACAGTGATGAAGAAGCTGCAATTGACAAACAAGGAACACCAGATCTGTGCTTGTTATCTCTAGTCCATCTGGCTCGAGATAAATCTTCTACAAACAACAAATCTACTGGTATACAAAGCCGGAGGAAAAAGATTCTTGATCTGTATGCTAATGTATGCAGTGTTGCAGAAGGTCTCAGTCCCACAGAGCTGCCTTTTGATTGTCTGGAGAAGACCAGCAGGATGCTCAGCTCTACATACAACACTGAAAAAGCTATTGTGAAGACTTGGCGTCACCTTGCTGAAAGCTTTGGACTGAAGCGTGATGAAATTGGGGGCATGACAGATGGCATGCAGCTCTTTGATCGCATCAGCACAGCAGGCTACAGTATCCCAGAACTCTTAACAAAACTAGTGCAAATTGAGCGGTTGGATGCTGTGGAGTCTCTCTGCGCAGATATTTTGGAGTGGGCACAAGTGATGCCCAAACCTGAACCAGTGGTGGCTTCGTGA');
armor.addAllele('no-armor', 'ATGGTGTGTCTGGGAGAATGCCGATGGCTTCACATGTTTCCATTCCTCATGGTATCACTTGTATATTCTGCTAATGCTGAATATTCTAACTGTGGTTAAAATGAGTACTACAACCAGACGACCGGGATGTGCCATGAGTGTCCACAATGTGAGCCAGGAGAAGAACCATACATGACATGTGGATATGGGACTAAAGATGAAGACTACGGCTGTGTTCCTTGTCCATCGGAAAAGTTTTCTAAAGGAGGTTATCAGATATGCAGGAGGCACAAGGATTGCGAGGGCTTCTTCCGGGCAACTGTTATGACACCTGGAGATCAAGAGAATGATGCAGAATGTGGGCCTTGTCTCCCCGGTTACTACATGTTAGAAAACCGGCCCCGGAATATCTATGGGATGGTTTGCTACTCATGCTCGCTGGCACCTCCAAACACCAAAGAATGTGCAGGTATTACTTCTGGTGCATCAGTCAGTTTCTCAAGTACTTCTGGAACAAGTACTCAATCTCCTTTCCGGCATATACACAAAGCAGATCTGACTGGACAAGGCCATCTTGCTACAGCTCTCATAATTGCTATGTCAACTATATTCATCATGGCTATTGCTATCGTCCTGATCATCATGTTCTACATTGTCAAAACAAAAACATCAGCACAAGCATGCTGCACCAGCCATCCTGTGAAGACTGTGGAAGCCCCAGCCATTATGCAGGAAGAAAAGAAAGAAGTACAAGAAAATGTAGTTATTTTCTCAGAGAAAGATGAGTTTGGAAAATTAACAGCAACTCCTGCAAAAGTGGTCAAGAGTGAAAATGATGCTTCCTCGGAGAATGAGAGACTTTTAAGTCGGAGCATGGACAGTGATGAAGAAGCTGCAATTGACAAACAAGGAACACCAGATCTGTGCTTGTTATCTCTAGTCCATCTGGCTCGAGATAAATCTTCTACAAACAACAAATCTACTGGTATACAAAGCCGGAGGAAAAAGATTCTTGATCTGTATGCTAATGTATGCAGTGTTGCAGAAGGTCTCAGTCCCACAGAGCTGCCTTTTGATTGTCTGGAGAAGACCAGCAGGATGCTCAGCTCTACATACAACACTGAAAAAGCTATTGTGAAGACTTGGCGTCACCTTGCTGAAAGCTTTGGACTGAAGCGTGATGAAATTGGGGGCATGACAGATGGCATGCAGCTCTTTGATCGCATCAGCACAGCAGGCTACAGTATCCCAGAACTCTTAACAAAACTAGTGCAAATTGAGCGGTTGGATGCTGTGGAGTCTCTCTGCGCAGATATTTTGGAGTGGGCACAAGTGATGCCCAAACCTGAACCAGTGGTGGCTTCGTGA');
$('#armor-dna').html('<div class="first">' + armor.alleles[0].dna_seq + '</div><div class="hidden">' + armor.alleles[1].dna_seq + '</div>');

// sdh
var sdh = new Gene('sdh', '104');
sdh.addAllele('sdh', 'ATGCCCGCCCTCACCGGAAGTGGCTGCGGCGGACCGTTCCGGCGAGAAGGAGAAGGCAAGATGGCGGCGTCCGCGGTGACCGCGGCGAAGAGGGCGAGCGCGGCGGCGGCGGCGCGGGTGAAACGCTTCGCGGTGTACCGGTGGGACCCGGACAAGCGCGGGGAGAAGCCCCGGATGCAGACCTACGAGGTGGACCTCAATAAATGTGGCCCAATGGTGCTGGATGCCCTGATCAAGATCAAGAACGAAATGGACCCCACGCTCACCTTCCGGCGCTCCTGCAGGGAAGGGATCTGCGGCTCCTGCGCCATGAACATCGGGGGCGGGAATACTCTGGCCTGCACCAAGCGCATCGACACCGACCTCGGCCGCACCACCAAGATCTACCCGCTGCCCCACATGTTTGTGGTCAAGGACCTCGTCCCCGACCTGAGCAACTTCTATGCCCAATACAAGGCCATCCAGCCCTACCTGAAGAAGAAGGACGAGTCCCGCCAAGGCCAGGAGCAGTACCTCCAGTCCATTGAGGACCGGGAAAAGCTGGACGGCCTGTATGAATGCATCCTCTGCGCCTGTTGCAGCACCAGTTGCCCCAGTTACTGGTGGAACGGGGACAAATACTTAGGCCCCGCTGTTCTCATGCAGGTAAGCAGA');
$('#sdh-dna').html('<div class="first">' + sdh.alleles[0].dna_seq + '</div>');

// myo
var myo = new Gene('myo', '112');
myo.addAllele('myo', 'ATGTTTAGTGGCGAAAGTGGCGCCGGGAAGACCGTGGCCGCCAAGTACATCATGGGCTACATTTCCAAGGTGTCTGGGGGTGGCGAAAAAGTTCAGCACGTCAAGGACATCATCCTCCAGTCCAACCCGCTGCTCGAAGCCTTCGGCAACGCCAAGACCGTCCGGAACAACAACTCCAGCCGATTTGGGAAATACTTCGAGATCCAGTTCAGCCGTGGAGGAGAACCCGACGGAGGGAAGATCTCCAACTTCCTGCTGGAAAAGTCCAGGGTGGTGAGCCAGAATGAGTGCGAGAGGAACTTCCACATCTACTATCAGCTCATTGAAGGCGCTACGGCCGACCAGAAACACAACTTGGGCATCATGACCCCGGATTACTATTATTACCTCAACCAGTCGGAGACGTACGTCGTGGACGGGACCGACGACCGCAGCGACTTCCAGGAAACCATGAACGCCATGGACGTCATTGGCATTGCTCGCCAAGATAAGCAACTCGTGGTGCAGATCATCGCCGGCATCCTTCACTTGGGCAACATCGGCTTCCAAGAGCAGGGCAACTACGCGCAAGTGGAGAACCCCGACTTACTCGCCTTCCCAGCCTACCTTTTGGGCATCGACAAGGACCGTCTGAACGACAAGCTGACCAGTCGCAAGATGGACAGCAAATGGGGCGGGCGCTCCGAGTCCATCAACGTCACCCTCAACGTCGAGCAGGCCTCCTACACTCGGGACGCCCTCGCCAAGGGGCTCTACTCCCGCGTCTTTGATTTCCTAGTGGAGTCGATCAACCGGGCGATGCGGAAACCGAACGAAGAGTATAGCATCGGCGTCCTGGACATATACGGCTTTGAAATATTTCAGAGGAACGGCTTTGAGCAATTCTGCATCAACTTCGTGAACGAGAAGCTGCAGCAGATCTTCATCGAGCTGACCCTCAAAGCCGAACAGGAAGAGTACGTTCAGGAGGGCATCAAATGGACCCCGATCGAGTATTTCAACAACAAAGTGGTGTGCGACCTCATTGAGAACAAGCTGAATCCTCCGGGCATCATGAGCATCTTGGATGACGTCTGCGCCACCGTCTACGCCAAAGGGGACGGGGCCGACCAGACGTTGTTGCAGAAACTGCAGTCGGCCGTCGGGACTCACGAGCATTTCAACGGCTCCAGCGGCGGATTCGTTGTCCACCACTACGCTGGCAAGGTCTCCTACGACGTGAGCGGCTTTTGCGAACGGAACCGGGACGTCCTGTTCACTGACCTGATCGAGCTGATGCAAAGCAGCGAATTCGCTTTCATCCGGACTCTTTTCCCCGAGAAACTCGACTCGGACAAAAAGGGACGGCCCACGACGGCCGGGAGCAAAATCAAAAAACAAGCCAACGACCTGGTGAACACGCTGATGAAGTGCACCCCGCACTACATCCGCTGCATCAAACCCAACGAGACCAAGAGGCCCCGTGACTGGGAGGAGAGCAGGGTGAAGCACCAAGTTGAGTACTTGGGGTTGAAGGAGAACATCCGAGTCCGCCGGGCCGGCTTTGCCTACCGCAGACTGTTCCAAAAATTCCTACAAAGGTACGCCATCCTGACCCCGGAGACCTGGCCGAGGTGGCGAGGAGATGGGCGTCAGGGCGTCCAGCATTTGTTGAGGTCCGTCAACATGGACGCCGACCAGTACCAGATGGGTCGCACCAAGGTTTTCGTCAAGAATCCAGAATCGCTCTTCCTTCTCGAAGAGATGCGGGAGCGCAAGTTTGACGGATTCGCCCGGGTCATCCAGAAAGCGTGGCGGCGCCACATCGCCATCCGGAAGTACGAGCAAATGCGGGAAGAAGCCTCCCACATCCTGTACAACTTCAAGGAGAGGCGACGGAACAGCATCAACCGCAACTTCGTGGGCGACTACCTGGGCATGGAGGACAAACCCGAGCTCCGCCAGTTCTTGGCCAAGAGGGAACGGATCGATTTCGCCGACTCGGTCACCAAGTACGACCGGAGGTTTAAG');
$('#myo-dna').html('<div class="first">' + myo.alleles[0].dna_seq + '</div>');

// deep/dilute
var deep = new Gene('deep', '120');
deep.addAllele('deep', 'ATGTATGCAAGGATTTGGATACCTGATTCAGAAGTGGTCTGGAAGTCAGCAGAACTTGTGAAAGATTATAAGCCAGGAGACAAAGTCCTCCATCTTCGACTTGAGGATGGCAAGGATCTTGAATACAGCCTCGATCCAAAGAAAAAGGATCTGCCACCCTTGCGAAACCCTGATATACTTGTGGGAGAAAATGACCTGACAGCACTCAGCTATCTCCATGAACCTGCTGTTCTCCATAACCTAAAAGTTCGGTTTATAGACTCGAAGCTCATTTACACATATTGTGGCATAGTTTTGGTAGCTATAAATCCTTACGAACAGCTGCCCATCTATGGCGAAGACATCATCAATGCGTACAGTGGCCAGAATATGGGGGATATGGACCCCCACATCTTTGCTGTGGCTGAGGAAGCATATAAACAGATGGCCAGGTATTTTGGAATTCTGAATGCTGGCTACTCAGCCTACACTATTACTGTTTTAGAAATCATTTTAAAGTATCTGCTACCTAATTGGCTGTGTTTGGCGCTTTTCGTGACGGTGCAAATTGAGCAAACTCAAACCCTTTCCGTGTTTTGTTTCCCCCCACAGTCCATTGGGAACGCCAAAACCACGCGGAATGATAACAGCAGTCGCTTTGGGAAGTACATTGAGATAGGTTTTGATAAGCGGTATCGAATTACTGGTGCTAACATGAGAACATACCTCCTAGAAAAATCAAGAGTGGTCTTCCAGGCCGACGAAGAGCGAAATTACCATATCTTTTATCAGCTTTGTGCTTCTGCAGCAGTGCCGGAATTTAAAACATTGCGGTTAGGCAATGCAGACTATTTTTACTATACAAAGCAAGGGGGCAGCCCAGTGATTGATGGTGTTGATGATGCAAAGGAGATGGCAAACACGAGGCGTGCGTGCACATTGTTAGGGATTGTTGATTCCTGCCAGATGGGAATTTTTCAAATCCTTGCTGCTATTCTTCACCTGGGCAATGTAGCATTTCAGTCTCGCGATTCCGACAGCTGTGTAATACCACCAAAACACGAACCTCTCAAGATTTTCTGTGACCTCATGGGAGTGGAGTATGACCAAATGGCTCACTGGCTCTGCCATAAGAAACTTGCCACTGCCACAGAGACATACATCAAGCCTATTTCCAAGCTGCAAGCCATCAACGGCAGGGATGCTCTTGCAAAACACATTTATGCCAATCTCTTTAACTGGATTGTCGATCACGTGAACAAAGCTCTTTATTCTCCCACGAAACAGCATTCGTTTATTGGTGTATTGGACATTTACGGGTTTGAAACATTTGAGATCAACAGCTTTGAACAATTTTGTATCAACTATGCCAATGAGAAACTGCAGCAACAGTTCAATATGCATGTATTTAAGCTAGAGCAAGAAGAATATATGAGGGAAGAAATTCCATGGACCTTGATTGATTTCTATGACAATCAACCCTGCATTAATCTCATAGAGGCCAAATTGGGAATTTTGGATTTATTAGATGAGGAATGTAAGATGCCTAAAGGTTCAGATAATAGTTGGGCCCAGAAATTATACAATACGCATTTGAACAAGACTTCGCTTTTTGAAAAACCCCGCTTGTCAAACAAGGCCTTTATCATCCAACACTTTGCAGATAAGGTAGGGGTTTTCTGTTTCAACAAAATGTGTTTTGACCAGAGCCATAGGCCAGGGGTCCCCAAACTAAGGCCCTCCAAGGTCATTGACCTGGCCCCTATGGCCTTTGAGGATCACTTTCCTTACCTATGGTCTTCTGATGGCCTGATGAGATCATCTAGATGCCCTTTGAGGGTCCCTTTCCTTACCGATGGTCTTATGAGACCATCTATGACTTCAGCACGGGGTCCGCGAATGGTGGGAGTTGCATTCAGAAATTCCCTGCATCTTCTCATGGAGACCCTTAATGCCACGACGCCACATTATGTGCGGTGTATTAAACCAAATGACTTCAAGATTCCATTCATGTTTGATGAAAAACGGACTGTGCAGCAGCTCCGGGCTTGCGGTGTGTTGGAAACCATCCGAATCAGTGCAGCTGGTTTTCCCTCGAGGTGGACATATCAAGAATTCTTCAGCCGCTACCGCGTCCTGATGAAGCAGAAGGACGTTCTCAGTGACAGAAAGCAGACCTGTAAAAACGTCTTGGAGAAGCTGATTCTGGACAAGGATAAATACCAGTTTGGGAAGACGAAAATATTTTTCCGGGCTGGCCAGGTGGCTTACATGGAAAAAATAAGGGCGGACAAACTCAGAGAGGCTTGCATCCGCATCCAAAAGACCATCAGAGGGTGGCTGTTCAGGAAGAAGTACCTGCGCATGCGGAAAGCGGCCATCACGGTTCAAAGATATGTCCGAGGATACCAGGCGCGATGCCTTGCCAGCTTTCTTCGGAGAACCAAAGCTGCCACCATTATCCAGAAATTCCGGCGCATGTACGCTACACGCAAGCGATACCGTCGCACACGAGCATCCACCGTGGCCCTTCAGTCCTACATGCGAGGTTATCTTGCCAGGAAGAAGTACCGCAGGATGCTTGAAGAGCACAAGGCCATCATTATCCAGAAGCACGTGCGCGGGTGGCTGAGCCGCAAGCGCTACCAGAAGACCTTGAAGGGCATTGTCTACTTGCAATGTTGCTGCCGGCGCATGATAGCCAAGAGGGAGTTGAAGAAGCTGAAGATCGAAGCCCGCTCTGTGGAACACTACAAGAAGCTCAACGTTGGCATGGAGAACAAGATCATGCAGCTCCAGCGTAAAATCAATGAGCAGTCAAAAGACTCCAAATCCCTGCTTGAGAAACTGACCACTCTTGAGGCAACATACAATTCTGAGACAGAAAAACTGAAGAATGATGTGGAAAGGCTTAGGATGAGTGAAGAAGAGGCCAAGAATGCGACCAACCGGCTCCTTACGCTTCAAGATGAGATCAGCAAGCTCCGAAAGGAACTGCACCAGACGCAGATTGCAAAGAAGACCATCGAGGAACAGGCAGATGTATATAAACAGGAGACAGACAAGCTGGTGCTAGAACTTACAGAGCAAAACACCCTGCTTAAAAAAGAAAAAGATGAGCTGAACCATCATATCCAGGAGCAGGCCAAAGAGATAACAGAGGTCATGGAGAAAAAGCTTCTTGAGGAGACGAAACAGCTGGACCTGGATCTGAATAATGAAAGGCAGCGGTATCAGAACCTCCTCCAAGAGTTTAGTCGGTTAGAGGAGCGATACGATGACCTCAAGGATGAGATGAATTTGATGGTGAACATCTCTAAGCCTGGACACAAACGAAGAGATTCCACACATAGCAACGAATCCGAAAATACCTATAGCTCTGAGATCACTGAACCAGAAGAGCTGCAAATGAGAACAGAGGATGAACCAAGTGAGAAGAAAGCTCCACTGGACATGTCTCTCTTCCTCAAGCTTCAAAAACGGGTTTCGGAGCTGGAGCAGGAAAAGCAATCCATGCAGGATGAGTTGGACAGGAAAGAAGAACAAGTTCTCCGAGCCAAGGCCAAGGAGGAGGAAAGGCCTCAAATGAGAGGTGCTGAGCTGGAATATGAATCACTTAAGCGTCAAGAGCTTGAATCAGAAAATAAGAAACTGAAGAATGAGTTGAATGAGCTGAGGAAAGCCCTGCTGGAAAAGAGCTCTCCAGATGCAACGGCTCCTGGTGCCCCGGGGTACAGAGTCCTCTTGGATCAGATGGCCTCTGTTAGCGAGGAACTAGAAGTGCGCAAGGAGGAAGTCCTCATCTTGAGATCTCAGCTGATGAGCCAGAAGGAGGCAATTCCACCCAAGGATGACAAGAACACGATGACTGACTCCACAATCCTTTTGGAGGATGTACAGAAGATGAAGGACAAAGGAGAGATAGCTCAGGCGTACATTGGTTTGAAGGAGACAAACAGGCTTCTGGAGTCTCAGCTACAGACTCAGAAAAGGAGCCATGACAATGAATTGGAAGCCCTCCGCGGAGAGATTCAAAGCCTGAAGGAGGAAAACAACCGCCAGCAACAGTTGCTGGCACAAAATCTCCAGTTGCCCCCAGAGGCCCGGATAGAAGCTAGCTTACAGCACGAGATCACCCGCCTGACGAATGAAAACCTGGATTTGATGGAACAGCTTGAAAAACAGGACAAGACTGTTCGCAAACTGAAAAAGCAACTCAAAGTCTTTGCTAAAAAGATTGACGAACTTGAAGTGGGTCAGATGGAGAACATTTCGCCTGGACAAATAATCGACGAGCCGATCCATCCTGTGAATATTCCAAGGAAAGAAAAAGACTTCCAGGGAATGTTGGAGTATAAGAGAGAGGATGAGCCCAAACTCATCAAGAACCTTATTTTAGAACTGAAACCACGTGGTGTTGCAGTCAATCTCATCCCAGGATTGCCTGCTTATATTCTGTTCATGTGCGTCCGCCATGCAGACTATGTTAATGATGATCAAAAAGTGAGGTCCTTGCTGACTTCCACGATTAATGGCATCAAGAAAATTTTGAAGAAAAGAGGTGATGACTTTGAAGCGGTTTCCTTCTGGCTGTCTAACACGTGCCGATTTTTGCACTGTTTGAAGCAGTACAGTGGCGAAGAGGCAAGTTTTGGGTTTATGAAGCACAACACGCCTCGTCAAAATGAACACTGCCTCCACAATTTTGACCTTGCCGAATACAGGCAAGTGCTGAGTGATTTGGCCATTCAGATTTATCAGCAGCTTGTAAGAGTGTTGGAGAATATTCTTCAGCCAATGATTGTTTCAGGGATGTTGGAACACGAAACTATCCAAGGGGTCTCGGGCGTAAAACCAACCGGCCTCCGAAAGAGAACCTCCAGCATTGCTGATGAAGGGACATACACACTAGACTCTATCATTCGGCAACAGAACACTTTCCACTCCATCATGTGTCAACATGGGATGGATCCAGAACTGATCAAACAGGTGGTCAAGCAGATGTTTTACATCATTGGGGCTGTGACCCTCAACAACCTCCTCCTGCGAAAAGACATGTGCTCCTGGAGTAAAGGGATGCAGATAAGGTACAATGTAAGTCAGCTTGAAGAATGGCTTCGGGACAAAAACCTGATGAATAGTGGTGCTAAGGAAACTCTGGAGCCCCTTATCCAGGCAGCACAGTTGTTGCAAGTGAAAAAGAAGACGGATGAAGATGCAGAGGCCATTTGCTGCATGTGCAATGCCTTAACTACTGCACAGATTGTTAAAGTTTTGAACTTGTATACTCCAGTTAATGAGTTTGAAGAAAGAGTGTCTGTGTCCTTCATCCGGACGATACAGCTGCGTATGAGAGACCGGAAAGACTCTCCTCAACTGCTGATGGATGCTAAGCATATTTTCCCCGTTACTTTCCCATTTAATCCCTCATCCCTTGCATTAGAAACCATCCAGATCCCAGCAAGTTTGGGTCTAGGATTCATCACTCGTGTCTGA');
deep.addAllele('dilute', 'ATGTATGCAAGGATTTGGATACCTGATTCAGAAGTGGTCTGGAAGTCAGCAGAACTTGTGAAAGATTATAAGCCAGGAGACAAAGTCCTCCATCTTTGACTTGAGGATGGCAAGGATCTTGAATACAGCCTCGATCCAAAGAAAAAGGATCTGCCACCCTTGCGAAACCCTGATATACTTGTGGGAGAAAATGACCTGACAGCACTCAGCTATCTCCATGAACCTGCTGTTCTCCATAACCTAAAAGTTCGGTTTATAGACTCGAAGCTCATTTACACATATTGTGGCATAGTTTTGGTAGCTATAAATCCTTACGAACAGCTGCCCATCTATGGCGAAGACATCATCAATGCGTACAGTGGCCAGAATATGGGGGATATGGACCCCCACATCTTTGCTGTGGCTGAGGAAGCATATAAACAGATGGCCAGGTATTTTGGAATTCTGAATGCTGGCTACTCAGCCTACACTATTACTGTTTTAGAAATCATTTTAAAGTATCTGCTACCTAATTGGCTGTGTTTGGCGCTTTTCGTGACGGTGCAAATTGAGCAAACTCAAACCCTTTCCGTGTTTTGTTTCCCCCCACAGTCCATTGGGAACGCCAAAACCACGCGGAATGATAACAGCAGTCGCTTTGGGAAGTACATTGAGATAGGTTTTGATAAGCGGTATCGAATTACTGGTGCTAACATGAGAACATACCTCCTAGAAAAATCAAGAGTGGTCTTCCAGGCCGACGAAGAGCGAAATTACCATATCTTTTATCAGCTTTGTGCTTCTGCAGCAGTGCCGGAATTTAAAACATTGCGGTTAGGCAATGCAGACTATTTTTACTATACAAAGCAAGGGGGCAGCCCAGTGATTGATGGTGTTGATGATGCAAAGGAGATGGCAAACACGAGGCGTGCGTGCACATTGTTAGGGATTGTTGATTCCTGCCAGATGGGAATTTTTCAAATCCTTGCTGCTATTCTTCACCTGGGCAATGTAGCATTTCAGTCTCGCGATTCCGACAGCTGTGTAATACCACCAAAACACGAACCTCTCAAGATTTTCTGTGACCTCATGGGAGTGGAGTATGACCAAATGGCTCACTGGCTCTGCCATAAGAAACTTGCCACTGCCACAGAGACATACATCAAGCCTATTTCCAAGCTGCAAGCCATCAACGGCAGGGATGCTCTTGCAAAACACATTTATGCCAATCTCTTTAACTGGATTGTCGATCACGTGAACAAAGCTCTTTATTCTCCCACGAAACAGCATTCGTTTATTGGTGTATTGGACATTTACGGGTTTGAAACATTTGAGATCAACAGCTTTGAACAATTTTGTATCAACTATGCCAATGAGAAACTGCAGCAACAGTTCAATATGCATGTATTTAAGCTAGAGCAAGAAGAATATATGAGGGAAGAAATTCCATGGACCTTGATTGATTTCTATGACAATCAACCCTGCATTAATCTCATAGAGGCCAAATTGGGAATTTTGGATTTATTAGATGAGGAATGTAAGATGCCTAAAGGTTCAGATAATAGTTGGGCCCAGAAATTATACAATACGCATTTGAACAAGACTTCGCTTTTTGAAAAACCCCGCTTGTCAAACAAGGCCTTTATCATCCAACACTTTGCAGATAAGGTAGGGGTTTTCTGTTTCAACAAAATGTGTTTTGACCAGAGCCATAGGCCAGGGGTCCCCAAACTAAGGCCCTCCAAGGTCATTGACCTGGCCCCTATGGCCTTTGAGGATCACTTTCCTTACCTATGGTCTTCTGATGGCCTGATGAGATCATCTAGATGCCCTTTGAGGGTCCCTTTCCTTACCGATGGTCTTATGAGACCATCTATGACTTCAGCACGGGGTCCGCGAATGGTGGGAGTTGCATTCAGAAATTCCCTGCATCTTCTCATGGAGACCCTTAATGCCACGACGCCACATTATGTGCGGTGTATTAAACCAAATGACTTCAAGATTCCATTCATGTTTGATGAAAAACGGACTGTGCAGCAGCTCCGGGCTTGCGGTGTGTTGGAAACCATCCGAATCAGTGCAGCTGGTTTTCCCTCGAGGTGGACATATCAAGAATTCTTCAGCCGCTACCGCGTCCTGATGAAGCAGAAGGACGTTCTCAGTGACAGAAAGCAGACCTGTAAAAACGTCTTGGAGAAGCTGATTCTGGACAAGGATAAATACCAGTTTGGGAAGACGAAAATATTTTTCCGGGCTGGCCAGGTGGCTTACATGGAAAAAATAAGGGCGGACAAACTCAGAGAGGCTTGCATCCGCATCCAAAAGACCATCAGAGGGTGGCTGTTCAGGAAGAAGTACCTGCGCATGCGGAAAGCGGCCATCACGGTTCAAAGATATGTCCGAGGATACCAGGCGCGATGCCTTGCCAGCTTTCTTCGGAGAACCAAAGCTGCCACCATTATCCAGAAATTCCGGCGCATGTACGCTACACGCAAGCGATACCGTCGCACACGAGCATCCACCGTGGCCCTTCAGTCCTACATGCGAGGTTATCTTGCCAGGAAGAAGTACCGCAGGATGCTTGAAGAGCACAAGGCCATCATTATCCAGAAGCACGTGCGCGGGTGGCTGAGCCGCAAGCGCTACCAGAAGACCTTGAAGGGCATTGTCTACTTGCAATGTTGCTGCCGGCGCATGATAGCCAAGAGGGAGTTGAAGAAGCTGAAGATCGAAGCCCGCTCTGTGGAACACTACAAGAAGCTCAACGTTGGCATGGAGAACAAGATCATGCAGCTCCAGCGTAAAATCAATGAGCAGTCAAAAGACTCCAAATCCCTGCTTGAGAAACTGACCACTCTTGAGGCAACATACAATTCTGAGACAGAAAAACTGAAGAATGATGTGGAAAGGCTTAGGATGAGTGAAGAAGAGGCCAAGAATGCGACCAACCGGCTCCTTACGCTTCAAGATGAGATCAGCAAGCTCCGAAAGGAACTGCACCAGACGCAGATTGCAAAGAAGACCATCGAGGAACAGGCAGATGTATATAAACAGGAGACAGACAAGCTGGTGCTAGAACTTACAGAGCAAAACACCCTGCTTAAAAAAGAAAAAGATGAGCTGAACCATCATATCCAGGAGCAGGCCAAAGAGATAACAGAGGTCATGGAGAAAAAGCTTCTTGAGGAGACGAAACAGCTGGACCTGGATCTGAATAATGAAAGGCAGCGGTATCAGAACCTCCTCCAAGAGTTTAGTCGGTTAGAGGAGCGATACGATGACCTCAAGGATGAGATGAATTTGATGGTGAACATCTCTAAGCCTGGACACAAACGAAGAGATTCCACACATAGCAACGAATCCGAAAATACCTATAGCTCTGAGATCACTGAACCAGAAGAGCTGCAAATGAGAACAGAGGATGAACCAAGTGAGAAGAAAGCTCCACTGGACATGTCTCTCTTCCTCAAGCTTCAAAAACGGGTTTCGGAGCTGGAGCAGGAAAAGCAATCCATGCAGGATGAGTTGGACAGGAAAGAAGAACAAGTTCTCCGAGCCAAGGCCAAGGAGGAGGAAAGGCCTCAAATGAGAGGTGCTGAGCTGGAATATGAATCACTTAAGCGTCAAGAGCTTGAATCAGAAAATAAGAAACTGAAGAATGAGTTGAATGAGCTGAGGAAAGCCCTGCTGGAAAAGAGCTCTCCAGATGCAACGGCTCCTGGTGCCCCGGGGTACAGAGTCCTCTTGGATCAGATGGCCTCTGTTAGCGAGGAACTAGAAGTGCGCAAGGAGGAAGTCCTCATCTTGAGATCTCAGCTGATGAGCCAGAAGGAGGCAATTCCACCCAAGGATGACAAGAACACGATGACTGACTCCACAATCCTTTTGGAGGATGTACAGAAGATGAAGGACAAAGGAGAGATAGCTCAGGCGTACATTGGTTTGAAGGAGACAAACAGGCTTCTGGAGTCTCAGCTACAGACTCAGAAAAGGAGCCATGACAATGAATTGGAAGCCCTCCGCGGAGAGATTCAAAGCCTGAAGGAGGAAAACAACCGCCAGCAACAGTTGCTGGCACAAAATCTCCAGTTGCCCCCAGAGGCCCGGATAGAAGCTAGCTTACAGCACGAGATCACCCGCCTGACGAATGAAAACCTGGATTTGATGGAACAGCTTGAAAAACAGGACAAGACTGTTCGCAAACTGAAAAAGCAACTCAAAGTCTTTGCTAAAAAGATTGACGAACTTGAAGTGGGTCAGATGGAGAACATTTCGCCTGGACAAATAATCGACGAGCCGATCCATCCTGTGAATATTCCAAGGAAAGAAAAAGACTTCCAGGGAATGTTGGAGTATAAGAGAGAGGATGAGCCCAAACTCATCAAGAACCTTATTTTAGAACTGAAACCACGTGGTGTTGCAGTCAATCTCATCCCAGGATTGCCTGCTTATATTCTGTTCATGTGCGTCCGCCATGCAGACTATGTTAATGATGATCAAAAAGTGAGGTCCTTGCTGACTTCCACGATTAATGGCATCAAGAAAATTTTGAAGAAAAGAGGTGATGACTTTGAAGCGGTTTCCTTCTGGCTGTCTAACACGTGCCGATTTTTGCACTGTTTGAAGCAGTACAGTGGCGAAGAGGCAAGTTTTGGGTTTATGAAGCACAACACGCCTCGTCAAAATGAACACTGCCTCCACAATTTTGACCTTGCCGAATACAGGCAAGTGCTGAGTGATTTGGCCATTCAGATTTATCAGCAGCTTGTAAGAGTGTTGGAGAATATTCTTCAGCCAATGATTGTTTCAGGGATGTTGGAACACGAAACTATCCAAGGGGTCTCGGGCGTAAAACCAACCGGCCTCCGAAAGAGAACCTCCAGCATTGCTGATGAAGGGACATACACACTAGACTCTATCATTCGGCAACAGAACACTTTCCACTCCATCATGTGTCAACATGGGATGGATCCAGAACTGATCAAACAGGTGGTCAAGCAGATGTTTTACATCATTGGGGCTGTGACCCTCAACAACCTCCTCCTGCGAAAAGACATGTGCTCCTGGAGTAAAGGGATGCAGATAAGGTACAATGTAAGTCAGCTTGAAGAATGGCTTCGGGACAAAAACCTGATGAATAGTGGTGCTAAGGAAACTCTGGAGCCCCTTATCCAGGCAGCACAGTTGTTGCAAGTGAAAAAGAAGACGGATGAAGATGCAGAGGCCATTTGCTGCATGTGCAATGCCTTAACTACTGCACAGATTGTTAAAGTTTTGAACTTGTATACTCCAGTTAATGAGTTTGAAGAAAGAGTGTCTGTGTCCTTCATCCGGACGATACAGCTGCGTATGAGAGACCGGAAAGACTCTCCTCAACTGCTGATGGATGCTAAGCATATTTTCCCCGTTACTTTCCCATTTAATCCCTCATCCCTTGCATTAGAAACCATCCAGATCCCAGCAAGTTTGGGTCTAGGATTCATCACTCGTGTCTGA');
$('#deep-dna').html('<div class="first">' + deep.alleles[0].dna_seq + '</div><div class="hidden">' + deep.alleles[1].dna_seq + '</div>');

// otc
var otc = new Gene('otc', '128');
otc.addAllele('otc', 'ATGCTGTTGAATTTTAGGTCTCTGTTCAATGCGGGACATGCCAACAGGATCCGCAAACATCTGGTGCAATGTCTTTGTTCCAGGCATGGGCAACCTACAGAATCTCCCATTCAGCTGAAAGGCCATGACCTTCTAACGTTACAAAATTATAAAGCAGAGGAAATCGAATATTTGCTTTGGGCAGCATCGGATTTAAAAGAGAGAATCAAACACAAGAAGGAGCATTTGCCTTTGCTGCAAGGAAAATCCTTAGCAATGATTTTTGAAAAAAGAAGCACAAGGACTAGAATATCTACAGAGACAGGATTTGCTCTCCTTGGAGGTCATCCCTGTTTCCTCACACTGCAAGACATTCACCTGGGCATTAATGAGAGCATCATGGACACAGCACGAGTATTGTCAACCATGACAGATGCAATCCTAGCACGAGTCTATAAACAGGGTGATCTAGAGATGTTGGCACAAGAGGCCACAATCCCCGTGATAAATGGACTGTCAGATTTTGACCATCCTATCCAGATTTTGGCTGATTACCTTACACTTCAGGAACACTACGGATCTTTGAAAGGTTTGACACTCAGCTGGATAGGTGATGGAAATAATGTTCTGAATTCTATTATGCTGAGTGCTGCTAAATTTGGGATGGATCTGCACATTGCTACTCCAAAAGGCTTTGAGCCAGATCCCATGGTGATTCAAATAGCAGAAGATTATTCCAGAAAGTACTGCACCAAACTGTTTCTCACCACTAATCCTCTTGAAGCTGCCAATGGAGCTAATGTTTTGATCACAGACACATGGATAAGCATGGGGCAAGAAGAAGAAAAACAAAAGAGGCTGAAAGCTTTCCAGGGTTACCAGATCACAATGGAGACTTGTAAAGTGGCTGCTCCCGATTGGACATTTTTACACTGTTTACCCAGAAAGCCAGAAGAAGTTGATGATGAAGTATTTTATTCTCCACAATCACTGGTTTTTCAAGAGGCTGAAAACAGGAAATGGACAATTACGGCTGTCATGGCTTCTCTGCTGACAGATTATTCACCACAGCTGCAAAAGCCTACATTTTGA');
otc.addAllele('otc-bog-breath', 'ATGGTGTTGAATTTTAGGTCTCTGTTCAATGCGGGACATGCCAACAGGATCCGCAAACATCTGGTGCAATGTCTTTGTTCCAGGCATGGGCAACCTACAGAATCTCCCATTCAGCTGAAAGGCCATGACCTTCTAACGTTACAAAATTATAAAGCAGAGGAAATCGAATATTTGCTTTGGGCAGCATCGGATTTAAAAGAGAGAATCAAACACAAGAAGGAGCATTTGCCTTTGCTGCAAGGAAAATCCTTAGCAATGATTTTTGAAAAAAGAAGCACAAGGACTAGAATATCTACAGAGACAGGATTTGCTCTCCTTGGAGGTCATCCCTGTTTCCTCACACTGCAAGACATTCACCTGGGCATTAATGAGAGCATCATGGACACAGCACGAGTATTGTCAACCATGACAGATGCAATCCTAGCACGAGTCTATAAACAGGGTGATCTAGAGATGTTGGCACAAGAGGCCACAATCCCCGTGATAAATGGACTGTCAGATTTTGACCATCCTATCCAGATTTTGGCTGATTACCTTACACTTCAGGAACACTACGGATCTTTGAAAGGTTTGACACTCAGCTGGATAGGTGATGGAAATAATGTTCTGAATTCTATTATGCTGAGTGCTGCTAAATTTGGGATGGATCTGCACATTGCTACTCCAAAAGGCTTTGAGCCAGATCCCATGGTGATTCAAATAGCAGAAGATTATTCCAGAAAGTACTGCACCAAACTGTTTCTCACCACTAATCCTCTTGAAGCTGCCAATGGAGCTAATGTTTTGATCACAGACACATGGATAAGCATGGGGCAAGAAGAAGAAAAACAAAAGAGGCTGAAAGCTTTCCAGGGTTACCAGATCACAATGGAGACTTGTAAAGTGGCTGCTCCCGATTGGACATTTTTACACTGTTTACCCAGAAAGCCAGAAGAAGTTGATGATGAAGTATTTTATTCTCCACAATCACTGGTTTTTCAAGAGGCTGAAAACAGGAAATGGACAATTACGGCTGTCATGGCTTCTCTGCTGACAGATTATTCACCACAGCTGCAAAAGCCTACATTTTGA');
$('#otc-dna').html('<div class="first">' + otc.alleles[0].dna_seq + '</div>');

// gpi
var gpi = new Gene('gpi', '136');
gpi.addAllele('gpi', 'ATGACTCTCTCGAGCGACGCGGCCTTCCAGAAGCTGAGGGAATGGCACAAGGCCCACGCCGCCCAGCTCGTCCTCCGGCAGCTCTTCGACGCCGACAAGGATCGCTTCCGGAAGTTCAGCTTGACTCTCAACACCGATCAGGGGGACATCCTGGTTGACTATTCGAAGAACCTCGTCACTGAAGATGTCATGAAGCTGTTGATTGACGTGGCAAAATCCAGGGGCATTGAAAAAGCCCGAGAGCAAATGTTCAGTGGGGAAAAGATCAACTTCACCGAGAACCGTGCCGTGCTCCACATCGCTCTGAGGAATCGCTCCAACACGCCCATCTTAGTGGACGGCAAAGACGTGGTTCCGGACGTGAACAAAGTGCTGGAGAAGATGAAGGGTTTCTGCCAGAAAGTTCGCAGTGGGGACTGGAAAGGCTACAGTGGGAAATCCATGACGGACGTGGTCAACGTTGGGATTGGCGGGTCAGACTTGGGCCCGCTGATGGTGACCGAAGCCCTGAAGCCGTACTCCAAGGGCGGCCCCCGCGTCTGGTTTGTGTCCAACATCGACGGCACCCACATGGCCAAGACCCTGGCCGAGCTCAACCCGGAGACAACGCTCTTCATCATTGCCTCCAAGACTTTCACCACTCAAGAGACCATCACCAACGCGGAGACGGCCAAGGAGTGGTTCCTTAAGGCAGCAAAAGATCCCGGTGCTGTGGCCAAGCATTTCGTCGCTCTTTCCACCAATGGGCCTAAAGTGAAAGATTTTGGGATCGACACTCAGAACATGTTCGAGTTTTGGGACTGGGTCGGGGGCCGCTATTCCTTGTGGTCGGCCATTGGCCTCTCCATCGCCCTCCACATCGGTTATGACAATTTTGAGAAATTGCTTGCTGGAGCCCACTGGATGGACAACCACTTCCGCACGACTCCGCTGGAGAAGAACGTCCCCGTGGTGCTGGCCATGCTGGGCGTCTGGTACATCAACTGCTATGGGACCGAGACCCATGCGCTCCTGCCCTACGACCAGTACATGCACCGCTTCGCAGCCTACTTCCAGCAGGGGGACATGGAATCCAACGGGAAGTACATCACCAAGAAGGGCACCCGGGTGAACTACAGCACCGGGCCCATCGTGTGGGGCGAGCCGGGAACCAACGGGCAGCATGCCTTCTACCAGCTCATCCACCAAGGAACGCGTATGATTCCTTGCGACTTCCTCATCCCGGTCCAGACGCAGAACCCCATCCGGAACGGGCTGCACCACAAGATCCTTCTGGCCAACTTCCTGGCCCAGACGGAGGCCTTGATGAAGGGCAAGACCACCGAGGAAGCCCGCCAAGAGCTCCAGGCGGCCGGGATGAGCGGAGACGCCCTGGAGAAGCTCCTTCCCCACAAGGTCTTTGAAGGCAACCGCCCCACCAATTCCATTATGTTTACTAAGCTGAATCCATTCATCCTTGGAGCCTTAATTGCCATGTACGAACACAAGATCTTTGTTCAAGGCGTCGTGTGGGATATCAACAGCTACGACCAATGGGGGGTGGAGCTGGGGAAGCAGCTGGCCAAGAAGATCGAGCCGGAGTTGTCCTCGGACGCGCCCGTCACCTCCCACGACTCCTCCACCAACGGCCTCATCGGCTTCATCCAGAAGCACCGGGCCTGA');
$('#gpi-dna').html('<div class="first">' + gpi.alleles[0].dna_seq + '</div>');

// nosespike
var nosespike = new Gene('nosespike', '360');
nosespike.addAllele('nosespike', 'ATGCAGACTTTCGACTGGATGAAAGTGAAGAGGAACCCCCCCAAAACAGGGAAAGCGGGC_GAGTACGGCTACGTGGGTCAGCCCAACACGGTCCGGACCAACTTCACCACCAAGCAGTTGACGGAACTGGAGAAAGAGTTCCACTTCAACAAATACCTGACCCGGGCCCGCAGGGTGGAGATCGCGGCCTCTTTGCAGCTCAACGAGACCCAGGTCAAGATCTGGTTCCAGAACCGCAGGATGAAGCAGAAGAAGCGGGAGAAAGAGGGCTTGCTGCCC');
nosespike.addAllele('no-nosespike', 'ATGCAGACTTTCGACTGGATGAAAGTGAAGAGGAACCCCCCCAAAACAGGGAAAGCGGGCGGAGTACGGCTACGTGGGTCAGCCCAACACGGTCCGGACCAACTTCACCACCAAGCAGTTGACGGAACTGGAGAAAGAGTTCCACTTCAACAAATACCTGACCCGGGCCCGCAGGGTGGAGATCGCGGCCTCTTTGCAGCTCAACGAGACCCAGGTCAAGATCTGGTTCCAGAACCGCAGGATGAAGCAGAAGAAGCGGGAGAAAGAGGGCTTGCTGCCC');
$('#nosespike-dna').html('<div class="first">' + nosespike.alleles[0].dna_seq + '</div><div class="hidden">' + nosespike.alleles[1].dna_seq + '</div>');

/* Gene Class
 *
 */
function Gene(gene_name, top, alleles) {
	this.gene_name = gene_name; // gene name
	this.top = top; // gene position (may not be necessary for now)
	this.alleles = []; // array of alleles
	
	// add alleles method
	this.addAllele = addAllele;
	function addAllele(allele_name, dna_seq) {
		this.alleles.push(new Allele(allele_name, dna_seq));
	}
}

/* Allele Class
 *
 */
function Allele(allele_name, dna_seq) {
	this.allele_name = allele_name;	
	this.dna_seq = dna_seq;
}

// gene/allele dna segment info
var $seqs = [];
$seqs['long-tail'] = tail.alleles[0].dna_seq;
$seqs['short-tail'] = tail.alleles[1].dna_seq;
$seqs['kink-tail'] = tail.alleles[2].dna_seq;
$seqs['metallic'] = metallic.alleles[0].dna_seq;
$seqs['non-metallic'] = metallic.alleles[1].dna_seq;
$seqs['wings'] = wings.alleles[0].dna_seq;
$seqs['no-wings'] = wings.alleles[1].dna_seq;
$seqs['horns'] = horns.alleles[0].dna_seq;
$seqs['no-horns'] = horns.alleles[1].dna_seq;
$seqs['color'] = color.alleles[0].dna_seq;
$seqs['no-color'] = color.alleles[1].dna_seq;
$seqs['black'] = black.alleles[0].dna_seq;
$seqs['brown'] = black.alleles[1].dna_seq;
$seqs['forelimbs'] = forelimbs.alleles[0].dna_seq;
$seqs['no-forelimbs'] = forelimbs.alleles[1].dna_seq;
$seqs['hindlimbs'] = hindlimbs.alleles[0].dna_seq;
$seqs['no-hindlimbs'] = hindlimbs.alleles[1].dna_seq;
$seqs['full-armor'] = armor.alleles[0].dna_seq;
$seqs['some-armor'] = armor.alleles[1].dna_seq;
$seqs['no-armor'] = armor.alleles[2].dna_seq;
$seqs['sdh'] = sdh.alleles[0].dna_seq;
$seqs['myo'] = myo.alleles[0].dna_seq;
$seqs['deep'] = deep.alleles[0].dna_seq;
$seqs['dilute'] = deep.alleles[1].dna_seq;
$seqs['otc'] = otc.alleles[0].dna_seq;
$seqs['otc-bog-breath'] = otc.alleles[1].dna_seq;
$seqs['gpi'] = gpi.alleles[0].dna_seq;
$seqs['nosespike'] = nosespike.alleles[0].dna_seq;
$seqs['no-nosespike'] = nosespike.alleles[1].dna_seq;

/*
 * Draggable Magnifier
 * Code below makes the viewport slider nicely draggable
 *
 */

// create an array of gene locations for use with draggable "magnifier"
var geneLocations;
if ($page_name == 'index.html') {
  geneLocations = [
	  //[magnifierPos, dnaPos]
	  [0,    0],          // start
	  [44,   59960],      // tail
	  [104,   119960],     // metallic
	  [404,  419960],     // wings
	  [494,  509960],     // horns
	  [577,  570000]      // end
  ];
} else if ($page_name == '2.html') {
  geneLocations = [
	  //[magnifierPos, dnaPos]
	  [0,    0],          // start
	  [74,  89960],      // color
	  [134,  149960],      // black
	  [464,  479960],      // forelimbs
	  [494,  509960],      // hindlimbs
	  [524,  539960],      // armor
	  [577,  570000]      // end
  ];
} else if ($page_name == '3.html') {
  geneLocations = [
	  //[magnifierPos, dnaPos]
	  [0,    0],          // start
	  [88,  103960],      // sdh
	  [96,  111960],      // myo
	  [104,  119960],      // deep
	  [112,  127960],      // otc
	  [120,  135960],      // gpi
	  [344,  359960],     // nosespike
	  [377,  370000]      // end
  ];
}


function moveDNAToEquivalentLocation(magTop) {
	var nextTrait, traitPos, i, ii,
			prevTraitPos, nextTraitPos, percentAlong,
			prevDnaPos, nextDnaPos, dnaPos;

	// first work out which two traits we are in between
	for (i = 0, ii = geneLocations.length; i < ii; i++) {
		traitPos = geneLocations[i][0];
		if (magTop <= traitPos) {
			nextTrait = i;
			break;
		}
	}

	// now we know we are between i-1 and i
	// work out how far between them
	prevTraitPos = geneLocations[i-1][0];
	nextTraitPos = geneLocations[i][0];

	// use a sigmoid function to accelerate between points and decelerate near points
	// note: this function was kind of just hacked together, there may be a cleaner function
	prevDnaPos = geneLocations[i-1][1];
	nextDnaPos = geneLocations[i][1];

	tanh = function(x) {
	  if( x < -3 )
		return -1;
	  else if( x > 3 )
		return 1;
	  else
		return x * ( 27 + x * x ) / ( 27 + 9 * x * x );
	}

	magDiff = nextTraitPos - prevTraitPos;
	magMidPoint = prevTraitPos + (magDiff/2);
	halfDnaDiff = (nextDnaPos - prevDnaPos)/2;
	dnaMidPoint = prevDnaPos + halfDnaDiff;
	snapFactor = 5; // a higher snap factor, e.g. 7, will make you hit the dna segment while further away

	dnaPos = ( tanh((magTop-magMidPoint)*(snapFactor/magDiff)) * halfDnaDiff ) + dnaMidPoint;

	// move to new DNA location
	$('#dna').css({top: -dnaPos});

	if (magTop == geneLocations[i][0] || (magTop < geneLocations[i][0] + 2 && magTop > geneLocations[i][0] - 2)) {
		$('#magnifier').css('background-position', '0 0');	
	} else {
		$('#magnifier').css('background-position', '0 -37px');	
	}

}