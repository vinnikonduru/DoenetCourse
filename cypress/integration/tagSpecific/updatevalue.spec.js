describe('UpdateValue Tag Tests',function() {

  beforeEach(() => {
    cy.visit('/test')
    

  })
  
  it('incrementing graph of line segments',() => {

    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <number name="step">20/<copy tname="count" /></number>
    <number name="count">2</number>
    <graph>
    <map assignNames="l1 l2 l3 l4 l5 l6 l7 l8 l9 l10 l11 l12 l13 l14 l15 l16" >
    <template newNamespace>
    <linesegment endpoints="($x, sin($x)) ($x+$(../step), sin($x+$(../step)))" />
    </template>
    <sources alias="x">
    <sequence from="-10" to="10-$step" length="$count" />
    </sources>
    </map>
    </graph>
    <p></p>
    <updatevalue label="double" mathtarget="$count" newmathvalue="2$count" />
    `},"*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let left=-10;

    cy.log(`check internal values`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      let count = 2;
      let step = 20/count;

      expect(components['/count'].stateValues.value).eq(count);
      expect(components['/step'].stateValues.value).eq(step);

      for(let ind=1; ind<= count; ind++) {
        expect(components['/l'+ind+'/_linesegment1'].stateValues.endpoints[0][0]
          .evaluate_to_constant()).closeTo(left+(ind-1)*step,1E-12);
        expect(components['/l'+ind+'/_linesegment1'].stateValues.endpoints[0][1]
          .evaluate_to_constant()).closeTo(Math.sin(left+(ind-1)*step),1E-12);
        expect(components['/l'+ind+'/_linesegment1'].stateValues.endpoints[1][0]
          .evaluate_to_constant()).closeTo(left+ind*step,1E-12);
        expect(components['/l'+ind+'/_linesegment1'].stateValues.endpoints[1][1]
          .evaluate_to_constant()).closeTo(Math.sin(left+ind*step),1E-12);
      }
    });

    cy.log('double number');
    cy.get('#\\/_updatevalue1').click();
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      let count = 4;
      let step = 20/count;


      expect(components['/count'].stateValues.value).eq(count);
      expect(components['/step'].stateValues.value).eq(step);

      for(let ind=1; ind<= count; ind++) {
        expect(components['/l'+ind+'/_linesegment1'].stateValues.endpoints[0][0]
          .evaluate_to_constant()).closeTo(left+(ind-1)*step,1E-12);
        expect(components['/l'+ind+'/_linesegment1'].stateValues.endpoints[0][1]
          .evaluate_to_constant()).closeTo(Math.sin(left+(ind-1)*step),1E-12);
        expect(components['/l'+ind+'/_linesegment1'].stateValues.endpoints[1][0]
          .evaluate_to_constant()).closeTo(left+ind*step,1E-12);
        expect(components['/l'+ind+'/_linesegment1'].stateValues.endpoints[1][1]
          .evaluate_to_constant()).closeTo(Math.sin(left+ind*step),1E-12);
      }
    });

    cy.log('double number a second time');
    cy.get('#\\/_updatevalue1').click();
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      let count = 8;
      let step = 20/count;


      expect(components['/count'].stateValues.value).eq(count);
      expect(components['/step'].stateValues.value).eq(step);

      for(let ind=1; ind<= count; ind++) {
        expect(components['/l'+ind+'/_linesegment1'].stateValues.endpoints[0][0]
          .evaluate_to_constant()).closeTo(left+(ind-1)*step,1E-12);
        expect(components['/l'+ind+'/_linesegment1'].stateValues.endpoints[0][1]
          .evaluate_to_constant()).closeTo(Math.sin(left+(ind-1)*step),1E-12);
        expect(components['/l'+ind+'/_linesegment1'].stateValues.endpoints[1][0]
          .evaluate_to_constant()).closeTo(left+ind*step,1E-12);
        expect(components['/l'+ind+'/_linesegment1'].stateValues.endpoints[1][1]
          .evaluate_to_constant()).closeTo(Math.sin(left+ind*step),1E-12);
      }
    });

    cy.log('double number a third time');
    cy.get('#\\/_updatevalue1').click();
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      let count = 16;
      let step = 20/count;


      expect(components['/count'].stateValues.value).eq(count);
      expect(components['/step'].stateValues.value).eq(step);

      for(let ind=1; ind<= count; ind++) {
        expect(components['/l'+ind+'/_linesegment1'].stateValues.endpoints[0][0]
          .evaluate_to_constant()).closeTo(left+(ind-1)*step,1E-12);
        expect(components['/l'+ind+'/_linesegment1'].stateValues.endpoints[0][1]
          .evaluate_to_constant()).closeTo(Math.sin(left+(ind-1)*step),1E-12);
        expect(components['/l'+ind+'/_linesegment1'].stateValues.endpoints[1][0]
          .evaluate_to_constant()).closeTo(left+ind*step,1E-12);
        expect(components['/l'+ind+'/_linesegment1'].stateValues.endpoints[1][1]
          .evaluate_to_constant()).closeTo(Math.sin(left+ind*step),1E-12);
      }
    });

  })

});