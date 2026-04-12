(function () {
    function initGraph() {
        var container = document.getElementById('research-graph');
        if (!container) return;
        if (typeof d3 === 'undefined') {
            // D3 not loaded yet — retry in 200ms
            setTimeout(initGraph, 200);
            return;
        }

        var width = container.clientWidth;
        var height = 600;

        // Node types: "mine" = my papers, "project" = my projects, "related" = literature
        var nodes = [
            // === My Publications ===
            { id: 'ease', label: 'EASe', year: 2026, type: 'mine', venue: 'arXiv 2026', url: 'https://arxiv.org/abs/2604.00276', desc: 'Domain-Agnostic Fine-Grained Mask Discovery' },
            { id: 'umdmix', label: 'UMDMix', year: 2025, type: 'mine', venue: 'Neurocomputing 2025', url: 'https://doi.org/10.1016/j.neucom.2025.131526', desc: 'Multi-Domain Mixing for LiDAR UDA' },
            { id: 'dense-urban', label: 'Dense Urban\nFeatures', year: 2024, type: 'mine', venue: 'ICPR 2024', url: 'https://doi.org/10.1007/978-3-031-88217-3_28', desc: 'Conditional GAN for Satellite Imagery' },

            // === My Research Projects ===
            { id: 'dst-project', label: 'Emergency\nVehicle Access', year: 2024, type: 'project', desc: 'LiDAR + Image segmentation for urban accessibility' },
            { id: 'musmix', label: 'MuSMix', year: 2024, type: 'project', desc: 'Multi-Source Mixing for 3D LiDAR UDA (M.S. Thesis)' },
            { id: 'soundscape', label: 'Soundscape\nMaps', year: 2023, type: 'project', desc: 'Cross-modal GAN for audio from street view images' },

            // === LiDAR Segmentation & Domain Adaptation (UMDMix/MuSMix cluster) ===
            { id: 'cosmix', label: 'CoSMix', year: 2022, type: 'related', venue: 'ECCV 2022', desc: 'Compositional Semantic Mix for LiDAR UDA' },
            { id: 'xmuda', label: 'xMUDA', year: 2020, type: 'related', venue: 'CVPR 2020', desc: 'Cross-Modal UDA for 3D Segmentation' },
            { id: 'unimix', label: 'UniMix', year: 2024, type: 'related', venue: 'CVPR 2024', desc: 'LiDAR Segmentation in Adverse Weather' },
            { id: 'minkeng', label: 'Minkowski\nEngine', year: 2019, type: 'related', venue: 'CVPR 2019', desc: '4D Spatio-Temporal Sparse ConvNets' },
            { id: 'cylinder3d', label: 'Cylinder3D', year: 2021, type: 'related', venue: 'CVPR 2021', desc: 'Cylindrical Partition for LiDAR Segmentation' },
            { id: 'squeezeseg', label: 'SqueezeSeg\nV2', year: 2019, type: 'related', venue: 'ICRA 2019', desc: 'UDA for Road-Object LiDAR Segmentation' },
            { id: 'synlidar', label: 'SynLiDAR', year: 2022, type: 'related', venue: 'AAAI 2022', desc: 'Synthetic LiDAR Dataset for Segmentation' },
            { id: 'pointdan', label: 'PointDAN', year: 2019, type: 'related', venue: 'NeurIPS 2019', desc: 'Domain Adaptation Network for Point Clouds' },
            { id: 'complete-label', label: 'Complete &\nLabel', year: 2021, type: 'related', venue: 'CVPR 2021', desc: 'Self-Training for LiDAR Segmentation' },
            { id: 'spvnas', label: 'SPVNAS', year: 2020, type: 'related', venue: 'ECCV 2020', desc: 'Sparse Point-Voxel Convolution' },

            // === Unsupervised Segmentation (EASe cluster) ===
            { id: 'diffcut', label: 'DiffCut', year: 2024, type: 'related', venue: 'NeurIPS 2024', desc: 'Zero-Shot Segmentation with Diffusion Features' },
            { id: 'stego', label: 'STEGO', year: 2022, type: 'related', venue: 'ICLR 2022', desc: 'Unsupervised Segmentation via Feature Distillation' },
            { id: 'cutler', label: 'CutLER', year: 2023, type: 'related', venue: 'CVPR 2023', desc: 'Cut-and-Learn for Unsupervised Instance Segmentation' },
            { id: 'dino', label: 'DINOv2', year: 2024, type: 'related', venue: 'TMLR 2024', desc: 'Self-Supervised Vision Foundation Model' },
            { id: 'sam', label: 'SAM', year: 2023, type: 'related', venue: 'ICCV 2023', desc: 'Segment Anything Model' },
            { id: 'clip', label: 'CLIP', year: 2021, type: 'related', venue: 'ICML 2021', desc: 'Contrastive Language-Image Pre-Training' },
            { id: 'tokencut', label: 'TokenCut', year: 2022, type: 'related', venue: 'TPAMI 2023', desc: 'Object Localization via Self-Supervised Transformers' },
            { id: 'maskcut', label: 'MaskCut', year: 2023, type: 'related', venue: 'CVPR 2023', desc: 'Mask Discovery from Self-Supervised Features' },
            { id: 'u2seg', label: 'U2Seg', year: 2024, type: 'related', venue: 'CVPR 2024', desc: 'Unsupervised Universal Image Segmentation' },
            { id: 'found', label: 'FOUND', year: 2023, type: 'related', venue: 'CVPR 2023', desc: 'Unsupervised Object Localization with FM' },
            { id: 'stable-diff', label: 'Stable\nDiffusion', year: 2022, type: 'related', venue: 'CVPR 2022', desc: 'Latent Diffusion Models for Image Synthesis' },

            // === GANs & Image Synthesis (Dense Urban / Soundscape cluster) ===
            { id: 'pix2pix', label: 'pix2pix', year: 2017, type: 'related', venue: 'CVPR 2017', desc: 'Image-to-Image Translation with Conditional GANs' },
            { id: 'spade', label: 'SPADE', year: 2019, type: 'related', venue: 'CVPR 2019', desc: 'Spatially-Adaptive Normalization for Semantic Synthesis' },
            { id: 'cyclegan', label: 'CycleGAN', year: 2017, type: 'related', venue: 'ICCV 2017', desc: 'Unpaired Image-to-Image Translation' },
            { id: 'deeplab', label: 'DeepLabV3+', year: 2018, type: 'related', venue: 'ECCV 2018', desc: 'Atrous Separable Convolution for Segmentation' },
            { id: 'unet', label: 'U-Net', year: 2015, type: 'related', venue: 'MICCAI 2015', desc: 'Convolutional Networks for Biomedical Segmentation' },
            { id: 'mobilenet', label: 'MobileNetV2', year: 2018, type: 'related', venue: 'CVPR 2018', desc: 'Inverted Residuals and Linear Bottlenecks' }
        ];

        var links = [
            // === UMDMix connections ===
            { source: 'umdmix', target: 'cosmix', strength: 0.95 },
            { source: 'umdmix', target: 'xmuda', strength: 0.7 },
            { source: 'umdmix', target: 'minkeng', strength: 0.6 },
            { source: 'umdmix', target: 'unimix', strength: 0.7 },
            { source: 'umdmix', target: 'musmix', strength: 1.0 },
            { source: 'umdmix', target: 'dst-project', strength: 0.8 },
            { source: 'umdmix', target: 'squeezeseg', strength: 0.5 },
            { source: 'umdmix', target: 'cylinder3d', strength: 0.5 },
            { source: 'umdmix', target: 'synlidar', strength: 0.6 },
            { source: 'umdmix', target: 'complete-label', strength: 0.5 },

            // === MuSMix connections ===
            { source: 'musmix', target: 'cosmix', strength: 0.85 },
            { source: 'musmix', target: 'xmuda', strength: 0.6 },
            { source: 'musmix', target: 'minkeng', strength: 0.6 },
            { source: 'musmix', target: 'pointdan', strength: 0.5 },
            { source: 'musmix', target: 'synlidar', strength: 0.5 },
            { source: 'musmix', target: 'cylinder3d', strength: 0.4 },

            // === DST Project connections ===
            { source: 'dst-project', target: 'minkeng', strength: 0.5 },
            { source: 'dst-project', target: 'xmuda', strength: 0.4 },
            { source: 'dst-project', target: 'cylinder3d', strength: 0.4 },
            { source: 'dst-project', target: 'spvnas', strength: 0.4 },

            // === EASe connections ===
            { source: 'ease', target: 'diffcut', strength: 0.85 },
            { source: 'ease', target: 'stego', strength: 0.7 },
            { source: 'ease', target: 'cutler', strength: 0.7 },
            { source: 'ease', target: 'dino', strength: 0.85 },
            { source: 'ease', target: 'sam', strength: 0.6 },
            { source: 'ease', target: 'clip', strength: 0.5 },
            { source: 'ease', target: 'maskcut', strength: 0.75 },
            { source: 'ease', target: 'tokencut', strength: 0.6 },
            { source: 'ease', target: 'u2seg', strength: 0.6 },
            { source: 'ease', target: 'found', strength: 0.6 },
            { source: 'ease', target: 'stable-diff', strength: 0.4 },

            // === Dense Urban connections ===
            { source: 'dense-urban', target: 'pix2pix', strength: 0.95 },
            { source: 'dense-urban', target: 'spade', strength: 0.6 },
            { source: 'dense-urban', target: 'cyclegan', strength: 0.5 },
            { source: 'dense-urban', target: 'deeplab', strength: 0.5 },
            { source: 'dense-urban', target: 'mobilenet', strength: 0.5 },
            { source: 'dense-urban', target: 'unet', strength: 0.4 },
            { source: 'dense-urban', target: 'soundscape', strength: 0.5 },

            // === Soundscape connections ===
            { source: 'soundscape', target: 'pix2pix', strength: 0.7 },
            { source: 'soundscape', target: 'spade', strength: 0.5 },
            { source: 'soundscape', target: 'cyclegan', strength: 0.4 },
            { source: 'soundscape', target: 'deeplab', strength: 0.4 },
            { source: 'soundscape', target: 'unet', strength: 0.4 },

            // === Cross-connections (my work) ===
            { source: 'ease', target: 'umdmix', strength: 0.25 },
            { source: 'umdmix', target: 'dense-urban', strength: 0.25 },
            { source: 'musmix', target: 'dst-project', strength: 0.6 },

            // === LiDAR cluster internal ===
            { source: 'cosmix', target: 'minkeng', strength: 0.5 },
            { source: 'cosmix', target: 'unimix', strength: 0.6 },
            { source: 'cosmix', target: 'synlidar', strength: 0.4 },
            { source: 'xmuda', target: 'pointdan', strength: 0.4 },
            { source: 'xmuda', target: 'squeezeseg', strength: 0.4 },
            { source: 'cylinder3d', target: 'minkeng', strength: 0.6 },
            { source: 'cylinder3d', target: 'spvnas', strength: 0.5 },
            { source: 'spvnas', target: 'minkeng', strength: 0.6 },
            { source: 'complete-label', target: 'synlidar', strength: 0.4 },
            { source: 'squeezeseg', target: 'pointdan', strength: 0.3 },

            // === Unsup. segmentation cluster internal ===
            { source: 'diffcut', target: 'dino', strength: 0.6 },
            { source: 'diffcut', target: 'stable-diff', strength: 0.7 },
            { source: 'stego', target: 'dino', strength: 0.7 },
            { source: 'cutler', target: 'dino', strength: 0.6 },
            { source: 'cutler', target: 'maskcut', strength: 0.8 },
            { source: 'maskcut', target: 'dino', strength: 0.6 },
            { source: 'tokencut', target: 'dino', strength: 0.7 },
            { source: 'u2seg', target: 'cutler', strength: 0.6 },
            { source: 'u2seg', target: 'stego', strength: 0.5 },
            { source: 'found', target: 'dino', strength: 0.6 },
            { source: 'found', target: 'tokencut', strength: 0.5 },
            { source: 'sam', target: 'dino', strength: 0.5 },
            { source: 'sam', target: 'clip', strength: 0.5 },
            { source: 'clip', target: 'stable-diff', strength: 0.4 },

            // === GAN cluster internal ===
            { source: 'pix2pix', target: 'cyclegan', strength: 0.7 },
            { source: 'pix2pix', target: 'spade', strength: 0.6 },
            { source: 'spade', target: 'cyclegan', strength: 0.4 },
            { source: 'deeplab', target: 'unet', strength: 0.4 },
            { source: 'deeplab', target: 'mobilenet', strength: 0.5 }
        ];

        // Colors by type
        var colors = {
            mine: '#cc4400',
            project: '#0066cc',
            related: '#888888'
        };

        var svg = d3.select(container).append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', '0 0 ' + width + ' ' + height);

        // Tooltip
        var tooltip = d3.select(container).append('div')
            .attr('class', 'graph-tooltip')
            .style('opacity', 0);

        var simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(function (d) { return d.id; }).distance(function (d) { return 80 - d.strength * 20; }))
            .force('charge', d3.forceManyBody().strength(-180))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(function (d) { return d.type === 'mine' ? 32 : d.type === 'project' ? 25 : 18; }));

        var link = svg.append('g')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('class', 'graph-link')
            .attr('stroke-width', function (d) { return 0.5 + d.strength * 1.5; })
            .attr('stroke-opacity', function (d) { return 0.1 + d.strength * 0.25; });

        var node = svg.append('g')
            .selectAll('g')
            .data(nodes)
            .join('g')
            .attr('class', 'graph-node')
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));

        node.append('circle')
            .attr('r', function (d) { return d.type === 'mine' ? 26 : d.type === 'project' ? 20 : 13; })
            .attr('fill', function (d) { return colors[d.type]; })
            .attr('fill-opacity', function (d) { return d.type === 'mine' ? 0.9 : d.type === 'project' ? 0.7 : 0.35; })
            .attr('stroke', function (d) { return colors[d.type]; })
            .attr('stroke-width', function (d) { return d.type === 'mine' ? 2.5 : 1; });

        node.append('text')
            .attr('class', 'graph-label')
            .attr('text-anchor', 'middle')
            .attr('dy', function (d) {
                var lines = d.label.split('\n');
                return lines.length > 1 ? '-0.3em' : '0.35em';
            })
            .each(function (d) {
                var el = d3.select(this);
                var lines = d.label.split('\n');
                if (lines.length > 1) {
                    el.text('');
                    lines.forEach(function (line, i) {
                        el.append('tspan')
                            .attr('x', 0)
                            .attr('dy', i === 0 ? '0em' : '1.1em')
                            .text(line);
                    });
                } else {
                    el.text(d.label);
                }
            })
            .style('font-size', function (d) { return d.type === 'mine' ? '9px' : d.type === 'project' ? '8px' : '7px'; })
            .style('font-weight', function (d) { return d.type === 'mine' ? '700' : '400'; });

        // Hover interactions
        node.on('mouseover', function (event, d) {
            var text = '<strong>' + d.label.replace(/\n/g, ' ') + '</strong>';
            if (d.year) text += ' (' + d.year + ')';
            if (d.venue) text += '<br>' + d.venue;
            text += '<br><em>' + d.desc + '</em>';
            tooltip.html(text)
                .style('left', (event.clientX + 15) + 'px')
                .style('top', (event.clientY - 10) + 'px')
                .transition().duration(150).style('opacity', 1);

            // Highlight connected edges and dim others
            link.attr('stroke-opacity', function (l) {
                return (l.source.id === d.id || l.target.id === d.id) ? 0.8 : 0.03;
            }).attr('stroke-width', function (l) {
                return (l.source.id === d.id || l.target.id === d.id) ? 2.5 : 0.5;
            });

            // Dim unconnected nodes
            var connected = {};
            connected[d.id] = true;
            links.forEach(function (l) {
                if (l.source.id === d.id) connected[l.target.id] = true;
                if (l.target.id === d.id) connected[l.source.id] = true;
            });
            node.select('circle').attr('fill-opacity', function (n) {
                if (n.id === d.id) return 1;
                if (connected[n.id]) return n.type === 'mine' ? 0.9 : n.type === 'project' ? 0.7 : 0.35;
                return 0.08;
            });
            node.select('text').attr('opacity', function (n) {
                return connected[n.id] ? 1 : 0.15;
            });
        })
        .on('mouseout', function () {
            tooltip.transition().duration(200).style('opacity', 0);
            link.attr('stroke-opacity', function (l) { return 0.1 + l.strength * 0.25; })
                .attr('stroke-width', function (l) { return 0.5 + l.strength * 1.5; });
            node.select('circle').attr('fill-opacity', function (d) {
                return d.type === 'mine' ? 0.9 : d.type === 'project' ? 0.7 : 0.35;
            });
            node.select('text').attr('opacity', 1);
        })
        .on('click', function (event, d) {
            if (d.url) window.open(d.url, '_blank');
        });

        simulation.on('tick', function () {
            nodes.forEach(function (d) {
                d.x = Math.max(35, Math.min(width - 35, d.x));
                d.y = Math.max(35, Math.min(height - 35, d.y));
            });

            link
                .attr('x1', function (d) { return d.source.x; })
                .attr('y1', function (d) { return d.source.y; })
                .attr('x2', function (d) { return d.target.x; })
                .attr('y2', function (d) { return d.target.y; });

            node.attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')'; });
        });

        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        // Respond to theme changes
        function updateColors() {
            var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            svg.selectAll('.graph-link').attr('stroke', isDark ? '#555' : '#999');
            svg.selectAll('.graph-label').attr('fill', isDark ? '#eee' : '#222');
        }
        updateColors();
        new MutationObserver(updateColors).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        // Resize
        window.addEventListener('resize', function () {
            width = container.clientWidth;
            svg.attr('width', width).attr('viewBox', '0 0 ' + width + ' ' + height);
            simulation.force('center', d3.forceCenter(width / 2, height / 2));
            simulation.alpha(0.3).restart();
        });
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGraph);
    } else {
        initGraph();
    }
})();
