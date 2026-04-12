(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var container = document.getElementById('research-graph');
        if (!container || typeof d3 === 'undefined') return;

        var width = container.clientWidth;
        var height = 500;

        // Node types: "mine" = my papers, "project" = my projects, "related" = literature
        var nodes = [
            // My Publications
            { id: 'ease', label: 'EASe', year: 2026, type: 'mine', venue: 'arXiv 2026', url: 'https://arxiv.org/abs/2604.00276', desc: 'Domain-Agnostic Fine-Grained Mask Discovery' },
            { id: 'umdmix', label: 'UMDMix', year: 2025, type: 'mine', venue: 'Neurocomputing 2025', url: 'https://doi.org/10.1016/j.neucom.2025.131526', desc: 'Multi-Domain Mixing for LiDAR UDA' },
            { id: 'dense-urban', label: 'Dense Urban\nFeatures', year: 2024, type: 'mine', venue: 'ICPR 2024', url: 'https://doi.org/10.1007/978-3-031-88217-3_28', desc: 'Conditional GAN for Satellite Imagery' },

            // My Research Projects
            { id: 'dst-project', label: 'Emergency\nVehicle Access', year: 2024, type: 'project', desc: 'LiDAR + Image segmentation for urban accessibility' },
            { id: 'musmix', label: 'MuSMix', year: 2024, type: 'project', desc: 'Multi-Source Mixing for 3D LiDAR UDA (M.S. Thesis)' },
            { id: 'soundscape', label: 'Soundscape\nMaps', year: 2023, type: 'project', desc: 'Cross-modal GAN for audio from street view images' },

            // Related Works - Domain Adaptation & LiDAR
            { id: 'cosmix', label: 'CoSMix', year: 2022, type: 'related', venue: 'ECCV 2022', desc: 'Compositional Semantic Mix for LiDAR UDA' },
            { id: 'xmuda', label: 'xMUDA', year: 2020, type: 'related', venue: 'CVPR 2020', desc: 'Cross-Modal UDA for 3D Segmentation' },
            { id: 'unimix', label: 'UniMix', year: 2024, type: 'related', venue: 'CVPR 2024', desc: 'Domain Adaptive LiDAR Segmentation in Adverse Weather' },
            { id: 'minkeng', label: 'Minkowski\nEngine', year: 2019, type: 'related', venue: 'CVPR 2019', desc: 'Sparse Convolutions for 3D Point Clouds' },

            // Related Works - Unsupervised Segmentation
            { id: 'diffcut', label: 'DiffCut', year: 2024, type: 'related', venue: 'NeurIPS 2024', desc: 'Zero-Shot Segmentation with Diffusion Features' },
            { id: 'stego', label: 'STEGO', year: 2022, type: 'related', venue: 'ICLR 2022', desc: 'Unsupervised Semantic Segmentation via Feature Distillation' },
            { id: 'cutler', label: 'CutLER', year: 2023, type: 'related', venue: 'CVPR 2023', desc: 'Unsupervised Instance Segmentation' },
            { id: 'dino', label: 'DINOv2', year: 2023, type: 'related', venue: 'TMLR 2024', desc: 'Self-Supervised Vision Foundation Model' },

            // Related Works - GANs & Generation
            { id: 'pix2pix', label: 'pix2pix', year: 2017, type: 'related', venue: 'CVPR 2017', desc: 'Image-to-Image Translation with Conditional GANs' },
            { id: 'spade', label: 'SPADE', year: 2019, type: 'related', venue: 'CVPR 2019', desc: 'Semantic Image Synthesis with Spatially-Adaptive Normalization' }
        ];

        var links = [
            // UMDMix connections
            { source: 'umdmix', target: 'cosmix', strength: 0.9 },
            { source: 'umdmix', target: 'xmuda', strength: 0.7 },
            { source: 'umdmix', target: 'minkeng', strength: 0.6 },
            { source: 'umdmix', target: 'unimix', strength: 0.7 },
            { source: 'umdmix', target: 'musmix', strength: 1.0 },
            { source: 'umdmix', target: 'dst-project', strength: 0.8 },

            // MuSMix connections
            { source: 'musmix', target: 'cosmix', strength: 0.8 },
            { source: 'musmix', target: 'xmuda', strength: 0.6 },
            { source: 'musmix', target: 'minkeng', strength: 0.6 },

            // DST Project connections
            { source: 'dst-project', target: 'minkeng', strength: 0.5 },
            { source: 'dst-project', target: 'xmuda', strength: 0.5 },

            // EASe connections
            { source: 'ease', target: 'diffcut', strength: 0.8 },
            { source: 'ease', target: 'stego', strength: 0.7 },
            { source: 'ease', target: 'cutler', strength: 0.7 },
            { source: 'ease', target: 'dino', strength: 0.8 },

            // Dense Urban connections
            { source: 'dense-urban', target: 'pix2pix', strength: 0.9 },
            { source: 'dense-urban', target: 'spade', strength: 0.6 },
            { source: 'dense-urban', target: 'soundscape', strength: 0.5 },

            // Soundscape connections
            { source: 'soundscape', target: 'pix2pix', strength: 0.7 },
            { source: 'soundscape', target: 'spade', strength: 0.5 },

            // Cross-paper connections (my work)
            { source: 'ease', target: 'umdmix', strength: 0.3 },
            { source: 'umdmix', target: 'dense-urban', strength: 0.3 },

            // Related work cross-connections
            { source: 'diffcut', target: 'dino', strength: 0.6 },
            { source: 'stego', target: 'dino', strength: 0.7 },
            { source: 'cutler', target: 'dino', strength: 0.5 },
            { source: 'cosmix', target: 'minkeng', strength: 0.5 },
            { source: 'cosmix', target: 'unimix', strength: 0.6 }
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
            .force('link', d3.forceLink(links).id(function (d) { return d.id; }).distance(function (d) { return 100 - d.strength * 30; }))
            .force('charge', d3.forceManyBody().strength(-250))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(function (d) { return d.type === 'mine' ? 35 : d.type === 'project' ? 28 : 22; }));

        var link = svg.append('g')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('class', 'graph-link')
            .attr('stroke-width', function (d) { return d.strength * 2; })
            .attr('stroke-opacity', function (d) { return 0.15 + d.strength * 0.3; });

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
            .attr('r', function (d) { return d.type === 'mine' ? 28 : d.type === 'project' ? 22 : 16; })
            .attr('fill', function (d) { return colors[d.type]; })
            .attr('fill-opacity', function (d) { return d.type === 'mine' ? 0.9 : d.type === 'project' ? 0.7 : 0.4; })
            .attr('stroke', function (d) { return colors[d.type]; })
            .attr('stroke-width', function (d) { return d.type === 'mine' ? 3 : 1.5; });

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
            .style('font-size', function (d) { return d.type === 'mine' ? '10px' : '8.5px'; })
            .style('font-weight', function (d) { return d.type === 'mine' ? '700' : '400'; });

        // Hover interactions
        node.on('mouseover', function (event, d) {
            var text = '<strong>' + d.label.replace('\n', ' ') + '</strong>';
            if (d.venue) text += '<br>' + d.venue;
            text += '<br><em>' + d.desc + '</em>';
            tooltip.html(text)
                .style('left', (event.offsetX + 15) + 'px')
                .style('top', (event.offsetY - 10) + 'px')
                .transition().duration(150).style('opacity', 1);

            // Highlight connected edges
            link.attr('stroke-opacity', function (l) {
                return (l.source.id === d.id || l.target.id === d.id) ? 0.8 : 0.05;
            });
        })
        .on('mouseout', function () {
            tooltip.transition().duration(200).style('opacity', 0);
            link.attr('stroke-opacity', function (l) { return 0.15 + l.strength * 0.3; });
        })
        .on('click', function (event, d) {
            if (d.url) window.open(d.url, '_blank');
        });

        simulation.on('tick', function () {
            // Keep nodes within bounds
            nodes.forEach(function (d) {
                d.x = Math.max(40, Math.min(width - 40, d.x));
                d.y = Math.max(40, Math.min(height - 40, d.y));
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
    });
})();
