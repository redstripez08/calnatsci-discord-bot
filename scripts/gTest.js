const { Gclass } = require("../classes/gclass");

(async() => {
    try {
        await Gclass.authorize();

        const English = new Gclass(155665494667);
        const ann = await English.getTopics();
        const lol = [];
    
        return;
        for (const announce of ann) {
            lol.push(announce.text);
        }
        console.log(lol.join(" "));
        // console.log(await English.getAnnouncements());
        // const lol = await Gclass.getCourses();
        // for (const course of lol) {
        //     console.log(`${course.name}: ${course.id}`);
        // }
    } catch (error) {
        console.error(error);
    }
})();

/*
   * 9P 2.0 ICT Class: 203078700683
   * Filipino 9: 198416790488
   * RESEARCH 1 PERSEUS: 183833305799
   * 9-Perseus: 182684162210
   * 9P 20-21 | CONSUMER CHEMISTRY | Ms. Pineda: 182795600129
   * 9 - P MAPEH 9: 189178902442
   * Grade 9-AP: 161272480736
   * Grade 9-EsP: 161272480672
   * SCIENCE (GRADE 9): 182828064901
   * 09-P_Math_9_AY_2020-2021: 183037947497
   * 9P-ICT CLASS: 40936306542
   * Geometry 9: 182507148084
   * English 9P: 155665494667
   * 9P - Advanced Physics I: 107457448786
*/