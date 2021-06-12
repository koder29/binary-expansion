import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';


type Datum = { id: string, parent: string, value: string, selected: boolean }

type FullGeneration = Array<Array<Datum>>;

function recursiveTick<T>(generations: FullGeneration): FullGeneration {
    const latestGen = generations[generations.length - 1];

    let newGen: Array<Datum> = [];
    for (let term of latestGen) {
        newGen.push(term);
        newGen.push(multiply(term, { id: uuidv4(), parent: term.id, selected: false, value: 'a' }))
        newGen.push(multiply(term, { id: uuidv4(), parent: term.id, selected: false, value: 'b' }))
    }

    return [...generations, newGen]

}

function multiply(a: Datum, b: Datum) {
    return {
        value: `${a.value}${b.value}`,
        id: uuidv4(),
        parent: a.id,
        selected: false,
        selectionColor: ''
    } as Datum;

}


export function Generations() {
    const [generations, setGenerations] = useState<FullGeneration>([[{ id: uuidv4(), value: '1', selected: false, parent: '' }]]);
    const [ticks, setTicks] = useState<number>(0);


    return (
        <div>

            <button onClick={e => {
                setGenerations(recursiveTick(generations));
                setTicks(ticks + 1);
            }}>Tick</button>

            <button onClick={e => {
                setGenerations([[{ value: '1', selected: false, id: uuidv4(), parent: '' }]]);
                setTicks(0);
            }}>Reset</button>
            <div >

                {
                    generations.map(currentGen => {
                        {
                            return (
                                <React.Fragment>
                                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {(currentGen.map((term, idx) => {
                                            return (

                                                <span
                                                    data-parent={term.parent}
                                                    data-id={term.id}

                                                    style={{ marginRight: '1rem', marginBottom: '2rem', borderBottom: ' 1px solid grey' }}
                                                    key={`${term.value}${idx}`}>
                                                    {term.value}
                                                </span>


                                            )
                                        }))}

                                    </div>
                                    <hr />
                                </React.Fragment>
                            )
                        }
                    })
                }
            </div>

        </div>
    );

}