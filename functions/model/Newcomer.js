
class Newcomer {

    constructor() {
      this.name = "";
      this.belongs = "";
      this.grade = "";
      this.interest = "";
      this.family = "";
      this.colorLabels = [
          "red",
          "pink",
          "purple",
          "deep-purple",
          "indigo",
          "blue",
          "light-blue",
          "cyan",
          "teal",
          "green",
          "light-green",
          "lime",
          "yellow",
          "amber",
          "orange",
          "deep-orange",
      ];
      this.brightness = [
          "darken-1",
          "darken-2",
          "darken-3",
          "darken-4",
      ];
      this.avatar = { color: this.generateAvatarColor() };
    }

    generateAvatarColor() {
        var color = this.randomChoseFrom(this.colorLabels);
        var brightness = this.randomChoseFrom(this.brightness);
        return color + brightness;
    }

    randomChoseFrom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

module.exports = Newcomer;
