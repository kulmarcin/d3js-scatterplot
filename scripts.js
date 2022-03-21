let myData;
let seconds;
let years;
const w = 950;
const h = 500;

fetch(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
)
  .then(res => res.json())
  .then(data => {
    myData = data;
    console.log(myData);
    const svg = d3
      .select('svg')
      .style('background-color', 'white')
      .attr('width', w)
      .attr('height', h);

    seconds = myData.map(el => el.Seconds);
    years = myData.map(el => el.Year);

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(seconds), d3.max(seconds)])
      .range([0, 450]);
    const yAxis = d3.axisLeft(yScale).tickFormat(function (d) {
      let m = Math.floor(d / 60);
      let s = d - m * 60;
      return `${m}:${s === 0 ? '00' : s}`;
    });

    svg.append('g').attr('transform', 'translate(100, 10)').call(yAxis);

    const xScale = d3
      .scaleLinear()
      .domain([1993, d3.max(years)])
      .range([0, 800]);
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));

    svg.append('g').attr('transform', 'translate(100, 460)').call(xAxis);

    svg
      .append('text')
      .text('Time in minutes')
      .attr('x', -300)
      .attr('y', 50)
      .attr('transform', 'rotate(-90)');

    svg
      .append('rect')
      .attr('x', 900)
      .attr('y', 100)
      .attr('fill', 'rgb(39, 39, 199)')
      .attr('width', 20)
      .attr('height', 20);

    svg.append('text').text('Doping allegations').attr('x', 720).attr('y', 115);

    svg
      .append('rect')
      .attr('x', 900)
      .attr('y', 130)
      .attr('fill', 'rgb(221, 144, 44)')
      .attr('width', 20)
      .attr('height', 20);

    svg
      .append('text')
      .text('No doping allegations')
      .attr('x', 690)
      .attr('y', 145);

    svg
      .selectAll('circle')
      .data(myData)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.Year))
      .attr('cy', d => yScale(d.Seconds))
      .attr('r', 5)
      .attr('transform', 'translate(100,10)')
      .attr('class', d => `${!d.Doping ? 'circle' : 'doping'} element`)
      .attr('data-name', d => d.Name)
      .attr('data-nationality', d => d.Nationality)
      .attr('data-doping', d => d.Doping)
      .attr('data-time', d => d.Time)
      .attr('data-year', d => d.Year);

    const circles = document.getElementsByClassName('element');

    for (let i = 0; i < circles.length; i++) {
      circles[i].addEventListener('mouseover', e => {
        const tooltip = document.getElementById('tooltip');
        tooltip.innerHTML = `<p><b>${e.target.getAttribute(
          'data-name'
        )}</b>: ${e.target.getAttribute('data-nationality')}</p>
          <p><b>Year:</b> ${e.target.getAttribute(
            'data-year'
          )}, <b>Time:</b> ${e.target.getAttribute('data-time')}</p>
          ${
            e.target.getAttribute('data-doping')
              ? '<p>' + e.target.getAttribute('data-doping') + '</p>'
              : ''
          }
          
          `;
        tooltip.style.top = e.y + 'px';
        tooltip.style.left = e.x + 10 + 'px';
        tooltip.style.backgroundColor = '#00536e';
        tooltip.style.opacity = 1;
      });

      circles[i].addEventListener('mouseleave', e => {
        const tooltip = document.getElementById('tooltip');
        tooltip.style.top = 0 + 'px';
        tooltip.style.left = 0 + 'px';
        tooltip.style.opacity = 0;
      });
    }
  })
  .catch(err => console.log(err));
