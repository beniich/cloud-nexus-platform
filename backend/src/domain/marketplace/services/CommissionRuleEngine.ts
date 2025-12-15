export class CommissionRuleEngine {
    static calculate(score: number): number {
        if (score > 90) return 0.10;
        if (score < 50) return 0.25;
        return 0.15;
    }
}
